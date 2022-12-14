/**
 * @swagger
 * components:
 *    schemas:
 *      Book:
 *        type: object
 *        required:
 *          - title
 *          - author
 *          - finished
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id of the book.
 *          title:
 *            type: string
 *            description: The title of your book.
 *          author:
 *            type: string
 *            description: Who wrote the book?
 *          finished:
 *            type: boolean
 *            description: Have you finished reading it?
 *          createdAt:
 *            type: string
 *            format: date
 *            description: The date of the record creation.
 *        example:
 *           title: The Pragmatic Programmer
 *           author: Andy Hunt / Dave Thomas
 *           finished: true
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API to manage your books.
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Creates a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       "200":
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */

const express = require("express");
const router = express.Router();

const books = require("../util/data");

router.get("/", function (req, res) {
  res.status(200).json(books);
});

router.get("/:id", function (req, res) {
  let book = books.find(function (item) {
    return item.id == req.params.id;
  });

  book ? res.status(200).json(book) : res.sendStatus(404);
});

router.post("/", function (req, res) {
  const { title, author, finished } = req.body;

  let book = {
    id: books.length + 1,
    title: title,
    author: author,
    finished: finished !== undefined ? finished : false,
    createdAt: new Date(),
  };

  books.push(book);

  res.status(201).json(book);
});

router.put("/:id", function (req, res) {
  let book = books.find(function (item) {
    return item.id == req.params.id;
  });

  if (book) {
    const { title, author, finished } = req.body;

    let updated = {
      id: book.id,
      title: title !== undefined ? title : book.title,
      author: author !== undefined ? author : book.author,
      finished: finished !== undefined ? finished : book.finished,
      createdAt: book.createdAt,
    };

    books.splice(books.indexOf(book), 1, updated);

    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:id", function (req, res) {
  let book = books.find(function (item) {
    return item.id == req.params.id;
  });

  if (book) {
    books.splice(books.indexOf(book), 1);
  } else {
    return res.sendStatus(404);
  }

  res.sendStatus(204);
});

module.exports = router;
