import { Hono } from 'hono';
import { exercises, series, workouts } from '@db/schema';
import { asc, desc, eq, sql } from 'drizzle-orm';
import dbConnection from '@src/db/connection';

const app = new Hono();

app.get('/:minMonth/:maxMonth', async (c) => {
	const db = await dbConnection(c);

	const minMonth = c.req.param('minMonth') ?? 1;
	const maxMonth = c.req.param('maxMonth') ?? new Date().getMonth() + 1;
	const year = new Date().getFullYear();
	const skip = +c.req.query('skip') ?? 0;

	const rows = await db
		.select()
		.from(workouts)
		.where(
			sql`extract('month' from ${workouts.createdAt}) BETWEEN ${minMonth} and ${maxMonth} and extract('year' from ${workouts.createdAt}) = ${year}`
		)
		.orderBy(desc(workouts.createdAt))
		.offset(skip);

	return c.json(rows);
});

app.get('/:year/:month', async (c) => {
	const db = await dbConnection(c);
	const year = c.req.param('year');
	const month = c.req.param('month');
	const skip = +c.req.query('skip') ?? 0;

	const rows = await db
		.select({
			workouts,
		})
		.from(workouts)
		.where(sql`extract('month' from ${workouts.createdAt}) = ${month} and extract('year' from ${workouts.createdAt}) = ${year}`)
		.orderBy(desc(workouts.createdAt))
		.limit(4)
		.offset(skip);

	return c.json(rows);
});

app.get('/:id', async (c) => {
	const db = await dbConnection(c);
	const workout = await db
		.select()
		.from(workouts)
		.where(eq(workouts.id, +c.req.param('id')));
	const rows = await db
		.select({
			series: series,
			exercise: exercises,
		})
		.from(series)
		.orderBy(asc(series.createdAt))
		.where(eq(series.workoutId, +c.req.param('id')))
		.leftJoin(exercises, eq(series.exerciseId, exercises.id));

	const _workout = workout?.length > 0 ? workout.shift() : null;
	return c.json({
		workout: _workout,
		timeline: rows,
	});
});

app.post('/', async (c) => {
	const db = await dbConnection(c);
	const { workoutDate = null } = await c.req.json();
	const _workoutDate = workoutDate ?? new Date().toISOString();
	const workout = await db
		.insert(workouts)
		.values({
			createdAt: new Date(_workoutDate),
		})
		.returning({ id: workouts.id });

	return c.json(workout?.[0].id || null);
});

app.put('/', async (c) => {
	const db = await dbConnection(c);
	const { workoutId, workoutDate = null } = await c.req.json();
	await db
		.update(workouts)
		.set({
			createdAt: new Date(workoutDate),
		})
		.where(eq(workouts.id, workoutId));

	return c.json(workoutId);
});

export default app;
