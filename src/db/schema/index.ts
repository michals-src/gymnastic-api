import { pgTable, integer, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

export const exercises = pgTable('exercises', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	muscle: text('muscle').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const workouts = pgTable('workouts', {
	id: serial('id').primaryKey(),
	durationTime: integer('duration_time').default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const series = pgTable('series', {
	id: serial('id').primaryKey(),
	status: integer('status').notNull().default(0),
	reps: text('reps'),
	exerciseId: integer('exercise_id').references(() => exercises.id),
	workoutId: integer('workout_id').references(() => workouts.id),
	createdAt: date('created_at').notNull().defaultNow(),
});
