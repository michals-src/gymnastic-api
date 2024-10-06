import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from 'hono/adapter';

const connectionLocal = async (context) => {
	const vars = env<any>(context);
	const sql = new pg.Client({
		connectionString: vars.DB_URL,
	});
	await sql.connect();

	return drizzle(sql);
};

export default connectionLocal;
