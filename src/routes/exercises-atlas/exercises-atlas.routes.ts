import dbConnection from '@src/db/connection';
import { exercises_atlas } from '@src/db/schema';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
	const db = await dbConnection(c);
	const resp = await db.select().from(exercises_atlas);

	return c.json(resp);
});

app.post('/', async (c) => {
	const request_body = await c.req.json();
	const _body_exercise_name: string = request_body.name;
	const _body_exercise_muscle_id: number = Number(request_body.muscle_id);

	try {
		const db = await dbConnection(c);
		const [_result_db] = await db
			.insert(exercises_atlas)
			.values({
				name: _body_exercise_name,
				muscle_id: _body_exercise_muscle_id,
			})
			.returning();

		return c.json(_result_db);
	} catch (message) {
		c.status(500);
		return c.json(message);
	}
});

export default app;
