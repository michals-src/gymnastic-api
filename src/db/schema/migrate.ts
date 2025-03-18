// import { drizzle } from 'drizzle-orm/neon-http';
// import { migrate } from 'drizzle-orm/neon-http/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const main = async () => {
	const client = new pg.Client({
		connectionString: 'postgres://postgres:postgres@127.0.0.1:5432/sensodb',
	});
	await client.connect();
	const db = drizzle(client);

	// const sql = neon(process.env.NEON_DB_URL);
	// const db = drizzle(sql);
	try {
		await migrate(db, { migrationsFolder: './src/db/drizzle' });
		console.log('Migration completed');
	} catch (error) {
		console.error('Error during migration:', error);
		process.exit(1);
	}

	await client.end();
};

main();
