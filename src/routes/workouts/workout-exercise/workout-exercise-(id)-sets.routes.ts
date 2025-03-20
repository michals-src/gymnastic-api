import { workout_sets } from '@db/schema';
import dbConnection from '@src/db/connection';
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
	const _body_workout_set_weight = request_body?.weight ?? 0;
	const _body_workout_set_count = request_body?.count ?? 0;

	const db = await dbConnection(c);
	const _result_insert = await db
		.insert(workout_sets)
		.values({
			workout_exercise_id: _params_workout_exercise_id,
			count: _body_workout_set_count,
			weight: _body_workout_set_weight,
		})
		.returning();

	return c.json({
		Items: _result_insert,
		TotalCount: _result_insert?.length || 0,
	});
});

export default app;
