import connectionLocal from '@src/db/connection/local';
import connectionNeon from '@src/db/connection/neon';
import { env } from 'hono/adapter';

enum DBFactory {
	Local = 'Local',
	Neon = 'Neon',
}

const dbConnectionFactory = (context) => {
	const vars = env<{
		DB_FACTORY: DBFactory;
	}>(context);

	if (vars.DB_FACTORY === DBFactory.Neon) {
		return connectionNeon;
	}
	return connectionLocal;
};

const dbConnection = async (context) => {
	return dbConnectionFactory(context)(context);
};

export default dbConnection;
