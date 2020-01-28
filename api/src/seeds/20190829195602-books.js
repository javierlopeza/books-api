const { parseDate } = require('../utils/seeds/Parser');
const getJSON = require('../utils/seeds/get-json');

const { Author } = require('../models');

module.exports = {
  up: async (queryInterface) => {
    const booksJson = await getJSON('books.json');
    const booksData = [];
    const authors = await Author.findAll();
    const authorsIds = {};
    authors.forEach((a) => { authorsIds[a.name] = a.id; });
    booksJson.books.forEach((book) => {
      const authorId = authorsIds[book.author];
      booksData.push({
        authorId,
        datePublished: parseDate(book.datePublished),
        description: book.description,
        imageUrl: book.imgUrl,
        title: book.title,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    return queryInterface.bulkInsert('Books', booksData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('Books', null, {}),
};
