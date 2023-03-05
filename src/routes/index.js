const { Router } = require("express");

const tagsRouter = require("./tags.routes");
const usersRouter = require("./users.routes");
const notesRouter = require("./notes.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/movie_notes", notesRouter);
routes.use("/movie_tags", tagsRouter);
routes.use("/sessions", sessionsRouter);

module.exports = routes;
