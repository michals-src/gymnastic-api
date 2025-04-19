import { Hono } from 'hono';
import atlasMuscles from './atlas-muscles/atlas-muscles.routes';
import atlasMusclesId from './atlas-muscles/atlas-muscles-(id).routes';
const app = new Hono();

app.route('/', atlasMuscles);
app.route('/', atlasMusclesId);

export default app;
