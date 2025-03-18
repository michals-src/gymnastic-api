import { Hono } from 'hono';
import muscleGroupsRoutes from './muscle-groups.routes';
import muscleGroupsIdRoutes from './muscle-groups-(id).routes';

const app = new Hono();

app.route('/', muscleGroupsRoutes);
app.route('/', muscleGroupsIdRoutes);

export default app;
