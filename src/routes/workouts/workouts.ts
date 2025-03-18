import { workouts } from '@db/schema';
import dbConnection from '@src/db/connection';
import { between, desc } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

type TWorkout = typeof workouts.$inferSelect;

app.post('/', async (c) => {
	const db = await dbConnection(c);
	const _request_query = await c.req.json();

	const _params_limit = Number(_request_query?.limit) || 6;
	const _params_skip = Number(_request_query?.skip) || 0;
	const _params_date = new Date(_request_query?.date);

	const _date_from: any = new Date(new Date(_params_date).setDate(1)).toISOString().replace('T', ' ').replace('Z', '');
	const _date_to: any = new Date(new Date(_params_date.getFullYear(), _params_date.getMonth() - 1, 0))
		.toISOString()
		.replace('T', ' ')
		.replace('Z', '');

	const rows = await db
		.select({
			workouts,
		})
		.from(workouts)
		.where(between(workouts.created_at, _date_from, _date_to))
		.orderBy(desc(workouts.created_at))
		.limit(_params_limit)
		.offset(_params_skip);

	return c.json(rows);
});

app.post('/', async (c) => {
	const db = await dbConnection(c);
	const _request_body = await c.req.json();
	const _body_date = _request_body?.date ? _request_body.date : new Date().toISOString();

	const [_result_insert] = await db
		.insert(workouts)
		.values({
			created_at: _body_date,
		})
		.returning();

	return c.json(_result_insert);
});

export default app;
