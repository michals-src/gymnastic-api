import { date, integer, pgTable, real, serial, text } from 'drizzle-orm/pg-core';

export const exercises = pgTable('exercises', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	muscle: text('muscle').notNull(),
	updatedAt: date('updated_at'),
	createdAt: date('created_at').notNull().defaultNow(),
});

export const series = pgTable('series', {
	id: serial('id').primaryKey(),
	status: integer('status').notNull().default(0),
	reps: text('reps'),
	exerciseId: integer('exercise_id').references(() => exercises.id),
	workoutId: integer('workout_id').references(() => workouts.id),
	updatedAt: date('updated_at'),
	createdAt: date('created_at').notNull().defaultNow(),
});

export const muscle_groups = pgTable('muscle_groups', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	updatedAt: date('updated_at'),
	createdAt: date('created_at').notNull().defaultNow(),
});

export const exercises_atlas = pgTable('exercises_atlas', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	muscle_id: integer('muscle_id').references(() => muscle_groups.id),
	updated_at: date('updated_at'),
	created_at: date('created_at').notNull().defaultNow(),
});

export const workouts = pgTable('workouts', {
	id: serial('id').primaryKey(),
	duration_time: integer('duration_time').default(0),
	updated_at: date('updated_at'),
	created_at: date('created_at').notNull().defaultNow(),
});

export const workout_exercises = pgTable('workout_exercises', {
	id: serial('id').primaryKey(),
	workout_id: integer('workout_id').references(() => workouts.id),
	exercise_id: integer('exercise_id').references(() => exercises.id),
	updated_at: date('updated_at'),
	created_at: date('created_at').notNull().defaultNow(),
});

export const workout_sets = pgTable('workout_sets', {
	id: serial('id').primaryKey(),
	workout_exercise_id: integer('workout_exercise_id').references(() => workout_exercises.id),
	weight: real('weight').default(0),
	count: real('count').default(0),
	order: integer('order').default(0),
	updated_at: date('updated_at'),
	created_at: date('created_at').notNull().defaultNow(),
});
