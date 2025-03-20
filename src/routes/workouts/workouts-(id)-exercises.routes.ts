import { exercises, workout_exercises } from '@db/schema';
import dbConnection from '@src/db/connection';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

app.get('/:id/exercises', async (c) => {
	const request_params = await c.req.param();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _request_params_id = Number(request_params?.id);

	const db = await dbConnection(c);
	const _result_db_workout_exercises = await db
		.select({
			id: workout_exercises.id,
			workout_id: workout_exercises.workout_id,
			exercise_id: workout_exercises.exercise_id,
			name: exercises.name,
		})
		.from(workout_exercises)
		.leftJoin(exercises, eq(exercises.id, workout_exercises.id))
		.where(eq(workout_exercises.workout_id, _request_params_id));

	return c.json({
		Items: _result_db_workout_exercises,
		TotalCount: _result_db_workout_exercises?.length || 0,
	});
});

app.post('/:id/exercises', async (c) => {
	const request_params = await c.req.param();
	const request_body = await c.req.json();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _params_workout_id = Number(request_params?.id);
	const _body_exercise_id = Number(request_body?.exerciseId);

	const db = await dbConnection(c);
	const [_result_insert] = await db
		.insert(workout_exercises)
		.values({
			workout_id: _params_workout_id,
			exercise_id: _body_exercise_id,
		})
		.returning();

	return c.json(_result_insert);
});

export default app;
