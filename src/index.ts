import { Hono } from 'hono';
import workoutsRouting from './routes/workouts';
import seriesRouting from './routes/series';
import exercisesRouting from './routes/exercises';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', async (c) => {
	return c.text('Hello Hono!');
});

app.use('*', cors());

app.route('/workouts', workoutsRouting);
app.route('/series', seriesRouting);
app.route('/exercises', exercisesRouting);

export default app;
