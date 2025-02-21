import { Hono } from 'hono';
import { exercises, series, workouts } from '@db/schema';
import { asc, between, desc, eq, sql } from 'drizzle-orm';
import dbConnection from '@src/db/connection';

const app = new Hono();

type TWorkout = typeof workouts.$inferSelect;

app.get('/', async (c) => {
	const db = await dbConnection(c);

	const from_date: any = c.req.query('from').replace('T', ' ').replace('Z', '');
	const to_date: any = c.req.query('to').replace('T', ' ').replace('Z', '');
	const skip = +c.req.query('skip') || 0;

	const _result = await db
		.select()
		.from(workouts)
		.where(between(workouts.createdAt, from_date, to_date))
		.orderBy(desc(workouts.createdAt))
		.offset(skip);

	const result_grouped = _result.reduce((group, item) => {
		const key_year_month = item.createdAt.replace(/(\d{4})-(\d{2})-\d{2}(.*)/g, '$1-$2');
		const _group = group.find((entities) => entities.key == key_year_month) || ({} as any);

		if (!Boolean(_group?.key)) {
			_group.key = key_year_month;
			_group.values = [];
			group.push(_group);
		}

		_group.values.push(item);

		return group;
	}, [] as Array<{ key: string; values: Array<TWorkout> }>);

	return c.json(result_grouped);
});

app.get('/:year/:month', async (c) => {
	const db = await dbConnection(c);
	const year = c.req.param('year');
	const month = c.req.param('month');
	const skip = +c.req.query('skip') || 0;

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
