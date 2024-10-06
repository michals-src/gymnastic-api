import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from 'hono/adapter';

const connectionNeon = async (context) => {
	const vars = env<any>(context);
	const sql = neon(vars.DB_URL);

	return drizzle(sql);
};

export default connectionNeon;
