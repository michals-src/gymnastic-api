import { workout_sets } from '@db/schema';
import dbConnection from '@src/db/connection';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

app.put('/sets/:id/', async (c) => {
	const request_params = await c.req.param();
	const request_body = await c.req.json();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _params_workout_set_id = Number(request_params?.id);
	const _body_workout_set_weight = request_body?.weight ?? 0;
	const _body_workout_set_count = request_body?.count ?? 0;

	const db = await dbConnection(c);
	const _result_update = await db
		.update(workout_sets)
		.set({
			count: _body_workout_set_count,
			weight: _body_workout_set_weight,
		})
		.where(eq(workout_sets.id, _params_workout_set_id))
		.returning();

	return c.json({
		Items: _result_update,
		TotalCount: _result_update?.length || 0,
	});
});

app.delete('/sets/:id/', async (c) => {
	const request_params = await c.req.param();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _params_workout_set_id = Number(request_params?.id);

	const db = await dbConnection(c);
	const [_result_delete] = await db.delete(workout_sets).where(eq(workout_sets.id, _params_workout_set_id)).returning();

	const _result_select = await db
		.select()
		.from(workout_sets)
		.where(eq(workout_sets.workout_exercise_id, _result_delete.workout_exercise_id));

	return c.json({
		Items: _result_select,
		TotalCount: _result_select?.length || 0,
	});
});

export default app;
