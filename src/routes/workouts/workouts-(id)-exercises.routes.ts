import { exercises, workout_exercises } from '@db/schema';
import dbConnection from '@src/db/connection';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

app.get('/:id/exercises', async (c) => {
	const request_params = await c.req.param();

	if (Number.isNaN(request_params?.id)) {
		c.status(400);
		return c.json(null);
	}

	const _request_params_id = Number(request_params?.id);

	const db = await dbConnection(c);
	const _result_db_workout_exercises = await db
		.select({
			id: workout_exercises.id,
			workout_id: workout_exercises.workout_id,
			exercise_id: workout_exercises.exercise_id,
			name: exercises.name,
		})
		.from(workout_exercises)
		.leftJoin(exercises, eq(exercises.id, workout_exercises.id))
		.where(eq(workout_exercises.workout_id, _request_params_id));

	return c.json({
		Items: _result_db_workout_exercises,
		TotalCount: _result_db_workout_exercises?.length || 0,
	});
});

// Dodawanie ćwiczenia do treningu
app.post('/:id/exercises/:exercise_id', async (c) => {});

// Usuwanie ćwiczenia z treningu
app.delete('/:id', async (c) => {});

export default app;
