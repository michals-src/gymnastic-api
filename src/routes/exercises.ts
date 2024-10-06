import { Hono } from 'hono';
import dbConnection from '@src/db/connection';
import { exercises } from '@src/db/schema';

const app = new Hono();

app.get('/', async (c) => {
	const db = await dbConnection(c);
	const resp = await db.select().from(exercises);

	return c.json(resp);
});

export default app;
