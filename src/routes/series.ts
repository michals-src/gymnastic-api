import { Hono } from 'hono';
import dbConnection from '@src/db/connection';
import { desc, eq, ne, and, between, asc } from 'drizzle-orm';
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

app.get('/trend/:exerciseId', async (c) => {
	const db = await dbConnection(c);
	const exercise_id = +c.req.param('exerciseId');

	const now = new Date();
	const _from_year = now.getMonth() - 6 < 0 ? now.getFullYear() - 1 : now.getFullYear();
	const from_date: any = new Date(_from_year, now.getMonth(), 1).toISOString().replace('T', ' ').replace('Z', '');
	const to_date: any = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().replace('T', ' ').replace('Z', '');

	const _result = await db
		.select({
			id: series.id,
			reps: series.reps,
			createdAt: series.createdAt,
		})
		.from(series)
		.where(and(between(series.createdAt, from_date, to_date), eq(series.exerciseId, exercise_id)))
		.orderBy(asc(series.workoutId));

	const _result_group_by = _result.reduce((group, series) => {
		if (series?.reps) {
			const _reps = JSON.parse(series?.reps);
			for (const [rep_index, props] of _reps.entries()) {
				const _key = String(rep_index + 1);
				const _group_values = group.find((g) => g.key === _key) || ({} as any);
				if (!Boolean(_group_values?.key)) {
					_group_values.key = _key;
					_group_values.values = [];
					group.push(_group_values);
				}
				_group_values.values.push(props);
			}
		}

		return group;
	}, []);

	return c.json(_result_group_by);
});

export default app;
