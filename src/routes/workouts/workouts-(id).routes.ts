import { exercises, series, workouts } from '@db/schema';
import dbConnection from '@src/db/connection';
import { asc, eq } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

app.get('/:id', async (c) => {
	const request_params = await c.req.param();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}
	const _request_params_id = Number(request_params?.id);

	const db = await dbConnection(c);
	const _result_db_workout = await db.select().from(workouts).where(eq(workouts.id, _request_params_id));

	const _result_db_sets = await db
		.select({
			series: series,
			exercise: exercises,
		})
		.from(series)
		.orderBy(asc(series.createdAt))
		.where(eq(series.workoutId, _request_params_id))
		.leftJoin(exercises, eq(series.exerciseId, exercises.id));

	const _workout = _result_db_workout?.length > 0 ? _result_db_workout.shift() : null;
	return c.json({
		workout: _workout,
		timeline: _result_db_sets,
	});
});

app.put('/:id', async (c) => {
	const request_params = await c.req.param();
	const request_body = await c.req.json();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _request_params_id = Number(request_params?.id);
	const _request_body_sets = request_body?.sets ?? null;

	const db = await dbConnection(c);
	await db
		.update(workouts)
		.set({
			reps: _request_body_sets,
			createdAt: new Date().toISOString(),
		})
		.where(eq(workouts.id, _request_params_id));

	return c.json(null);
});

app.delete('/:id', async (c) => {
	const request_params = await c.req.param();
	const request_body = await c.req.json();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _request_params_id = Number(request_params?.id);

	const db = await dbConnection(c);
	await db.delete(workouts).where(eq(workouts.id, _request_params_id));

	return c.json(null);
});

export default app;
