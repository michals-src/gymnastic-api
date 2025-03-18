import dbConnection from '@src/db/connection';
import { exercises_atlas } from '@src/db/schema';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

app.get('/:id', async (c) => {
	const id = Number(c.req.param('id'));

	const db = await dbConnection(c);
	const [_result_db] = await db.select().from(exercises_atlas).where(eq(exercises_atlas.id, id));

	return c.json(_result_db);
});

app.put('/:id', async (c) => {
	try {
		const request_params = await c.req.param();
		const request_body = await c.req.json();

		if (Number.isNaN(request_params?.id)) {
			c.status(400);
			return c.json(null);
		}

		const _request_params_id = Number(request_params?.id);
		const _body_exercise_name = request_body?.name ? { name: request_body?.name } : {};
		const _body_exercise_muscle_id = request_body?.muscle_id ? { muscle_id: request_body?.muscle_id } : {};

		const _update_set = {
			..._body_exercise_name,
			..._body_exercise_muscle_id,
		};

		if (!Object.keys(_update_set)?.length) {
			c.status(400);
			return c.json(null);
		}

		const db = await dbConnection(c);
		const [_result_update] = await db
			.update(exercises_atlas)
			.set(_update_set)
			.where(eq(exercises_atlas.id, _request_params_id))
			.returning();

		return c.json(_result_update);
	} catch (message) {
		return c.json({ message });
	}
});

app.delete('/:id', async (c) => {
	const request_params = await c.req.param();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _request_params_id = Number(request_params?.id);

	const db = await dbConnection(c);
	await db.delete(exercises_atlas).where(eq(exercises_atlas.id, _request_params_id));

	return c.json({
		status: true,
	});
});

export default app;
