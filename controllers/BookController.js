const { Book, Genre, GenreBook } = require("../models/index");

const BookController = {
  async insert(req, res) {
    // Book.create(req.body)
    // .then(book=>{
    //    book.addGenre(req.body.GenreId)//para insertar en la tabla intermedia
    //    res.send(book)
    // })
    // .catch(err => console.error(err))
    try {
      const book = await Book.create(req.body);
      book.addGenre(req.body.GenreId); //para insertar en la tabla intermedia
      res.send(book);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async getAll(req, res) {
    try {
      const books = await Book.findAll({
        include: [{ model: Genre, through: { attributes: [] } }],
      });
      res.send(books);
    } catch (error) {
      console.error(error);
    }
  },
  async delete(req, res) {
    try {
      await Book.destroy({
        where: {
          id: req.params.id,
        },
      });
      await GenreBook.destroy({
        where: {
          BookId: req.params.id,
        },
      });
      res.send({ message: "The book has been removed" });
    } catch (error) {
      console.log(error);
    }
    // Book.destroy({
    //   where: {
    //     id: req.params.id,
    //   },
    // })
    //   .then(() => {
    //     GenreBook.destroy({
    //       where: {
    //         BookId: req.params.id,
    //       },
    //     });
    //     res.send("Libro eliminado con éxito");
    //   })
    //   .catch((err) => console.error(err));
  },
  async update(req, res) {
    try {
      //actualizamos libro
      await Book.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      const book = await Book.findByPk(req.params.id); //nos traemos libro por id
      book.setGenres(req.body.GenreId); // actualizamos el género o generos del libro
      res.send("Libro actualizado con éxito");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "no ha sido posible actualizado el   libro" });
    }
  },
};

module.exports = BookController;
