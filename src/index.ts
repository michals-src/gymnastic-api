import { Hono } from 'hono';

import workoutsRouting from './routes/workouts/workouts';
import seriesRouting from './routes/series';
import exercisesAtlasRouting from './routes/exercises-atlas/index.routes';
import muscleGroupsRouting from './routes/muscle-groups/index.routes';

import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', async (c) => {
	return c.text('Hello Hono!');
});

app.use('*', cors());

app.route('/muscle-groups', muscleGroupsRouting);
app.route('/exercises-atlas', exercisesAtlasRouting);

app.route('/workouts', workoutsRouting);
app.route('/series', seriesRouting);

// app.get('/migration', async (context) => {
// 	const db = await dbConnection(context);
// 	const _exercises_db_result = await db
// 		.select({
// 			exercise_name: exercises.name,
// 			exercise_musle: exercises.muscle,
// 		})
// 		.from(exercises);

// 	const _muscle_groups = _exercises_db_result
// 		.reduce((group, _exercise_result) => {
// 			if (group.indexOf(_exercise_result.exercise_name) === -1) {
// 				group.push(_exercise_result);
// 			}
// 			return group;
// 		}, [])
// 		.map((name) => ({
// 			name,
// 		}));

// 	const _muscle_groups_db_result = await db.insert(muscle_groups).values(_muscle_groups).returning();

// 	return context.json(_muscle_groups_db_result);
// });

// app.get('/migration', async (context) => {
// 	const db = await dbConnection(context);
// 	const _exercises_db_result = await db
// 		.select({
// 			exercise_name: exercises.name,
// 			exercise_musle: exercises.muscle,
// 		})
// 		.from(exercises);

// 	const _muscle_groups_db_result = await db
// 		.select({
// 			muscle_group_id: muscle_groups.id,
// 			muscle_group_name: muscle_groups.name,
// 		})
// 		.from(muscle_groups);

// 	const _muscle_groups = _exercises_db_result.map(({ exercise_name, exercise_musle }) => ({
// 		name: exercise_name,
// 		muscle_id: _muscle_groups_db_result.find((_result) => _result.muscle_group_name === exercise_musle)?.muscle_group_id,
// 	}));

// 	const _exercises_atlas_db_result = await db.insert(exercises_atlas).values(_muscle_groups).returning();

// 	return context.json(_exercises_atlas_db_result);
// });

// app.get('/migration', async (context) => {
// 	const db = await dbConnection(context);
// 	const _exercises_db_result = await db
// 		.select({
// 			exercise_name: exercises.name,
// 			exercise_musle: exercises.muscle,
// 		})
// 		.from(exercises);

// 	const _muscle_groups_db_result = await db
// 		.select({
// 			muscle_group_id: muscle_groups.id,
// 			muscle_group_name: muscle_groups.name,
// 		})
// 		.from(muscle_groups);

// 	const _muscle_groups = _exercises_db_result.map(({ exercise_name, exercise_musle }) => ({
// 		name: exercise_name,
// 		muscle_id: _muscle_groups_db_result.find((_result) => _result.muscle_group_name === exercise_musle)?.muscle_group_id,
// 	}));

// 	const _exercises_atlas_db_result = await db.insert(exercises_atlas).values(_muscle_groups).returning();

// 	return context.json(_exercises_atlas_db_result);
// });

// app.get('/migration', async (context) => {
// 	const db = await dbConnection(context);
// 	const _series_db_select = await db
// 		.select({
// 			id: series.id,
// 			reps: series.reps,
// 			workoutId: series.workoutId,
// 			exerciseId: series.exerciseId,
// 		})
// 		.from(series);

// 	const _workout_exercises_select: any = await db.select().from(workout_exercises);

// 	const _workout_sets = _workout_exercises_select.reduce((_sets, _workout_exercise) => {
// 		const _series_db =
// 			_series_db_select.find(
// 				(series) => series.exerciseId === _workout_exercise.exercise_id && series.workoutId === _workout_exercise.workout_id
// 			) ?? null;

// 		if (Boolean(_series_db)) {
// 			const _series = _series_db.reps ? JSON.parse(_series_db?.reps ?? '') : null;
// 			if (Boolean(_series_db?.reps)) {
// 				for (let i in _series) {
// 					const _set = _series[i];
// 					_sets.push({
// 						workout_exercise_id: _workout_exercise.id,
// 						weight: Number(_set.weight),
// 						count: Number(_set.count),
// 						order: Number(i) + 1,
// 					});
// 				}
// 			}
// 		}
// 		return _sets;
// 	}, []);

// 	const _workout_sets_insert = await db.insert(workout_sets).values(_workout_sets).returning();

// 	return context.json(_workout_sets_insert);
// });

export default app;
