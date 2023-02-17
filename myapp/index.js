const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
app.use(express.json());
const path = require("path");
const filepath = path.join(__dirname, "goodreads.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: filepath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server has starting at https://localhost:3000");
    });
  } catch (e) {
    console.log(`error ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/books/", async (request, response) => {
  const querytorun = `
    SELECT * FROM 
    book
    ORDER BY 
    book_id;`;

  const dataofbooks = await db.all(querytorun);
  response.send(dataofbooks);
});
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const querytorun = `
    SELECT * FROM 
    book
   WHERE
    book_id=${bookId};`;
  const dataofbooks = await db.get(querytorun);
  response.send(dataofbooks);
});
app.post("/books/", async (request, response) => {
  const bookdetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookdetails;
  const addBookQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;
  const dataofbooks = await db.run(addBookQuery);
  const bookdet = dataofbooks.lastID;
  response.send({ bookdet: bookdet });
});
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;

  const updateBookQuery = `
    UPDATE
      book
    SET
      title='${title}',
      author_id=${authorId},
      rating=${rating},
      rating_count=${ratingCount},
      review_count=${reviewCount},
      description='${description}',
      pages=${pages},
      date_of_publication='${dateOfPublication}',
      edition_language='${editionLanguage}',
      price= ${price},
      online_stores='${onlineStores}'
    WHERE
      book_id = ${bookId};`;
  await db.run(updateBookQuery);
  response.send("books succesfully updated");
});
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const delquery = `
    DELETE FROM 
     book
    WHERE 
      book_id = ${bookId};`;
  await db.run(delquery);
  response.send("book has successfully delete");
});

app.get("/author/:authorId/books/:bookId", async (request, resonese) => {
  const { authorId, bookId } = request.params;
  const details = `
    SELECT * FROM 
    book
    WHERE
    author_id=${authorId} AND book_id=${bookId}`;
  const authordetails = await db.all(details);
  resonese.send(authordetails);
});
