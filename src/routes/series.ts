import { Hono } from 'hono';
import dbConnection from '@src/db/connection';
import { desc, eq, ne, and } from 'drizzle-orm';
import { series } from '@src/db/schema';

const app = new Hono();

app.post('/', async (c) => {
	const db = await dbConnection(c);
	const { exerciseId, workoutId, reps = null } = await c.req.json();

	const resp = await db
		.insert(series)
		.values({
			reps,
			exerciseId,
			workoutId,
		})
		.returning({ id: series.id });

	return c.json(resp?.[0].id || null);
});

app.put('/:id', async (c) => {
	const db = await dbConnection(c);
	const id = +c.req.param('id');
	const { reps } = await c.req.json();

	const resp = await db
		.update(series)
		.set({
			reps,
		})
		.where(eq(series.id, id))
		.returning({ id: series.id });

	return c.json(resp?.[0].id || null);
});

app.get('/previous/:seriesId/:exerciseId', async (c) => {
	const db = await dbConnection(c);
	const seriesId = +c.req.param('seriesId');
	const exerciseId = +c.req.param('exerciseId');
	const resp = await db
		.select()
		.from(series)
		.where(and(eq(series.exerciseId, exerciseId), ne(series.id, seriesId)))
		.orderBy(desc(series.workoutId))
		.limit(1);

	return c.json(resp);
});

export default app;
