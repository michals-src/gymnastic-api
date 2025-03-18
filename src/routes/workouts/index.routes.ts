import { Hono } from 'hono';
import workoutsRoutes from './workouts';
import workoutsIdRoutes from './workouts-(id).routes';

const app = new Hono();

app.route('/', workoutsRoutes);
app.route('/', workoutsIdRoutes);

export default app;
