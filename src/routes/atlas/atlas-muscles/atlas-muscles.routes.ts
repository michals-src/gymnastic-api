import dbConnection from '@src/db/connection';
import { muscle_groups } from '@src/db/schema';
import { Hono } from 'hono';

const app = new Hono();

app.get('/muscles/', async (c) => {
	const db = await dbConnection(c);
	const _result_select = await db.select().from(muscle_groups);

	return c.json(_result_select);
});

app.post('/muscles/', async (c) => {
	const request_body = await c.req.json();
	const _body_exercise_name = request_body.name;

	const db = await dbConnection(c);
	const [_result_insert] = await db
		.insert(muscle_groups)
		.values({
			name: _body_exercise_name,
		})
		.returning();

	return c.json(_result_insert);
});

export default app;
