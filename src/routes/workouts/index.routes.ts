import { Hono } from 'hono';
import workoutsRoutes from './workouts';
import workoutsIdRoutes from './workouts-(id).routes';
import workoutExerciseIdRoutes from './workout-exercise/workout-exercise-(id).routes';
import workoutExerciseIdSetsRoutes from './workout-exercise/workout-exercise-(id)-sets.routes';
import workoutSetsIdRoutes from './workout-sets/workout-sets-(id).routes';

const app = new Hono();

app.route('/', workoutsRoutes);
app.route('/', workoutsIdRoutes);
app.route('/', workoutExerciseIdRoutes);
app.route('/', workoutExerciseIdSetsRoutes);
app.route('/', workoutSetsIdRoutes);

export default app;
