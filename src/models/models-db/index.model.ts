import { exercises_atlas, muscle_groups, workout_exercises, workout_sets, workouts } from '@db/schema';

export type WorkoutsModel = typeof workouts.$inferSelect;
export type WorkoutExercisesModel = typeof workout_exercises.$inferSelect;
export type WorkoutSetsModel = typeof workout_sets.$inferSelect;

export type ExercisesAtlasModel = typeof exercises_atlas.$inferSelect;
export type MuscleGroupsModel = typeof muscle_groups.$inferSelect;
