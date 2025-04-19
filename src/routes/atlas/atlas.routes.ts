import dbConnection from '@src/db/connection';
import { exercises_atlas, muscle_groups } from '@src/db/schema';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
	const db = await dbConnection(c);
	const muscles = await db.select().from(muscle_groups);
	const exercises = await db.select().from(exercises_atlas);

	return c.json(resp);
});

export default app;
