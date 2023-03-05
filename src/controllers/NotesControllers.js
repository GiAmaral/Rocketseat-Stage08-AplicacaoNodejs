const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;

    if (rating < 1 || rating > 5) {
      response
        .status(400)
        .json({ message: "O rating deve ser um valor entre 1 e 5" });
    }

    const note_id = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        user_id,
        name_tag: name,
      };
    });

    await knex("movie_tags").insert(tagsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags")
      .where({ note_id: id })
      .orderBy("name_tag");

    const user = await knex("users").where({ id: note.user_id }).first();

    return response.json({
      ...note,
      tags,
      user,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title } = request.query;

    const user_id = request.user.id;

    let notes;

    if (title) {
      notes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    } else {
      notes = await knex("movie_notes").where({ user_id }).orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const notesTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: notesTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = NotesController;
