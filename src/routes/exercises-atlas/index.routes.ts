import { Hono } from 'hono';
import exercisesAtlasRoutes from './exercises-atlas.routes';
import exercisesAtlasIdRoutes from './exercises-atlas-(id).routes';

const app = new Hono();

app.route('/', exercisesAtlasRoutes);
app.route('/', exercisesAtlasIdRoutes);

export default app;
