import dbConnection from '@src/db/connection';
import { muscle_groups } from '@src/db/schema';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

app.get('/:id', async (c) => {
	const db = await dbConnection(c);
	const _result_select = await db.select().from(muscle_groups);

	return c.json(_result_select);
});

app.put('/:id', async (c) => {
	try {
		const request_params = await c.req.param();
		const request_body = await c.req.json();

		if (Number.isNaN(request_params?.id)) {
			throw Error(`Invalid parameter id`);
		}

		const _request_params_id = Number(request_params?.id);
		const _body_exercise_name = request_body.name;

		const db = await dbConnection(c);
		const [_result_update] = await db
			.update(muscle_groups)
			.set({
				name: _body_exercise_name,
			})
			.where(eq(muscle_groups.id, _request_params_id))
			.returning();

		return c.json(_result_update);
	} catch (message) {
		c.status(400);
		return c.json({
			status: false,
			message,
		});
	}
});

app.put('/:id', async (c) => {
	try {
		const request_params = await c.req.param();

		if (Number.isNaN(request_params?.id)) {
			throw Error(`Invalid parameter id`);
		}
		const _request_params_id = Number(request_params?.id);

		const db = await dbConnection(c);
		const [_result_update] = await db.delete(muscle_groups).where(eq(muscle_groups.id, _request_params_id)).returning();

		return c.json({
			status: true,
		});
	} catch (message) {
		c.status(400);
		return c.json({
			status: false,
			message,
		});
	}
});

export default app;
