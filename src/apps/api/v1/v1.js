import express from "express";
const v1 = express.Router();

import CategoriesRouter from "./categories/categories.router.js";
import SessionsRouter from "./sessions/sessions.router.js";
import ExercisesRouter from "./exercises/exercises.router.js";
import UsersRouter from "./users/users.router.js";

v1.use("/categories", CategoriesRouter);
v1.use("/sessions", SessionsRouter);
v1.use("/exercises", ExercisesRouter);
v1.use("/users", UsersRouter);

export default v1;
