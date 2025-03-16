import dbConnection from "@src/db/connection"
import { exercises } from "@src/db/schema"
import { eq } from "drizzle-orm"
import { Hono } from "hono"

const app = new Hono()

app.get("/", async (c) => {
  const db = await dbConnection(c)
  const resp = await db.select().from(exercises)

  return c.json(resp)
})

app.get("/:id", async (c) => {
  const id = Number(c.req.param("id"))

  const db = await dbConnection(c)
  const _result_db = await db.select().from(exercises).where(eq(exercises.id, id))

  return c.json(_result_db)
})

app.post("/", async (c) => {
  const request_body = await c.req.json()
  const _body_exercise_name = request_body.name
  const _body_exercise_muscle = request_body.muscle
  //   const _body_exercise_muscle_id = request_body.muscle_id

  const db = await dbConnection(c)
  const _result_db = await db
    .insert(exercises)
    .values({
      name: _body_exercise_name,
      muscle: _body_exercise_muscle,
    })
    .returning()

  return c.json(_result_db)
})

app.put("/:id", async (c) => {
  const request_params = await c.req.param()
  const request_body = await c.req.json()

  if (Number.isNaN(request_params?.id)) {
    c.status(400)
    return c.json(null)
  }

  const _request_params_id = Number(request_params?.id)
  const _body_exercise_name = request_body?.name ?? null
  const _body_exercise_muscle = request_body?.muscle ?? null
  //   const _body_exercise_muscle_id = request_body.muscle_id

  const _update_set = {}
  if (_body_exercise_name) {
    _update_set["name"] = _update_set
  }
  if (_body_exercise_muscle) {
    _update_set["muscle"] = _body_exercise_muscle
  }

  if (!Object.keys(_update_set)?.length) {
    c.status(400)
    return c.json(null)
  }

  const db = await dbConnection(c)
  const _result_db = await db.update(exercises).set(_update_set).where(eq(exercises.id, _request_params_id)).returning()

  return c.json(_result_db)
})

app.delete("/:id", async (c) => {
  const request_params = await c.req.param()

  if (Number.isNaN(request_params?.id)) {
    c.status(400)
    return c.json(null)
  }

  const _request_params_id = Number(request_params?.id)

  const db = await dbConnection(c)
  await db.delete(exercises).where(eq(exercises.id, _request_params_id))

  return c.json(null)
})

export default app
