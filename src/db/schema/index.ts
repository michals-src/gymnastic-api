import { date, integer, pgTable, serial, text } from "drizzle-orm/pg-core"

export const muscle_groups = pgTable("muscle_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  updatedAt: date("updated_at"),
  createdAt: date("created_at").notNull().defaultNow(),
})

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  muscle: text("muscle").notNull(),
  updatedAt: date("updated_at"),
  createdAt: date("created_at").notNull().defaultNow(),
})

export const exercise_group = pgTable("exercise_group", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  muscle_id: integer("muscle_id").references(() => muscle_groups.id),
  updatedAt: date("updated_at"),
  createdAt: date("created_at").notNull().defaultNow(),
})

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  durationTime: integer("duration_time").default(0),
  updatedAt: date("updated_at"),
  createdAt: date("created_at").notNull().defaultNow(),
})

export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  status: integer("status").notNull().default(0),
  reps: text("reps"),
  exerciseId: integer("exercise_id").references(() => exercises.id),
  workoutId: integer("workout_id").references(() => workouts.id),
  updatedAt: date("updated_at"),
  createdAt: date("created_at").notNull().defaultNow(),
})

export const workout_series = pgTable("workout_sets", {
  id: serial("id").primaryKey(),
  weight: integer("weight").default(0),
  count: integer("count").default(0),
  updatedAt: date("updated_at"),
  createdAt: date("created_at").notNull().defaultNow(),
})

export const workout_series_meta = pgTable("workout_set_meta", {
  workout_series_id: integer("workout_series_id").references(() => workout_series.id),
  workout_id: integer("workout_id").references(() => workouts.id),
  exercise_id: integer("exercise_id").references(() => exercises.id),
  updatedAt: date("updated_at"),
  createdAt: date("created_at").notNull().defaultNow(),
})
