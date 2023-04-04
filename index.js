const express = require("express");
const app = express(); //inicializar express
const PORT = 3000;

app.use(express.json()); //parseamos el body

app.use("/genres", require("./routes/genres"));
app.use("/books", require("./routes/books"));
app.use("/users", require("./routes/users"));

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`));
