const { Genre } = require("../models/index");

const GenreController = {
  async insert(req, res) {
    try {
      await Genre.create(req.body);
      res.status(201).send("Genero creado con éxito");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
    // Genre.create(req.body)
    //   .then((genre) =>
    //     res.status(201).send({ msg: "Género creado con éxito", genre })
    //   )
    //   .catch((err) => console.error(err));
  },
};

module.exports = GenreController;
