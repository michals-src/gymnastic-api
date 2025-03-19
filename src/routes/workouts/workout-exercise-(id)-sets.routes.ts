import { workout_exercises, workout_sets } from '@db/schema';
import dbConnection from '@src/db/connection';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

app.post('/exercises/:id/sets', async (c) => {
	const request_params = await c.req.param();
	const request_body = await c.req.json();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _params_workout_exercise_id = Number(request_params?.id);
	const _body_workout_exercise_sets = request_body?.exerciseSets ?? [];

	const _workout_exercise_sets = _body_workout_exercise_sets.map((set) => ({
		workout_exercise_id: _params_workout_exercise_id,
		count: set.count,
		weight: set.weight,
	}));

	const db = await dbConnection(c);
	const _result_insert = await db.insert(workout_sets).values(_workout_exercise_sets).returning();

	return c.json({
		Items: _result_insert,
		TotalCount: _result_insert?.length || 0,
	});
});

app.delete('/exercises/:id/sets', async (c) => {
	const request_params = await c.req.param();
	const request_body = await c.req.json();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _params_workout_id = Number(request_params?.id);
	const _body_exercise_id = Number(request_body?.exerciseId);

	const db = await dbConnection(c);
	const [_result_delete] = await db
		.delete(workout_exercises)
		.where(and(eq(workout_exercises.workout_id, _params_workout_id), eq(workout_exercises.exercise_id, _body_exercise_id)))
		.returning();
	await db.delete(workout_sets).where(eq(workout_sets.workout_exercise_id, _result_delete.id));

	return c.json({
		status: true,
	});
});

export default app;
