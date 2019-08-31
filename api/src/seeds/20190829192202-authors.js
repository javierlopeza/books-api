const getJSON = require('../utils/seeds/get-json');

module.exports = {
  up: async (queryInterface) => {
    const authorsJson = await getJSON('authors.json');
    const authorsData = [];
    authorsJson.authors.forEach((name) => {
      authorsData.push({
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    return queryInterface.bulkInsert('Authors', authorsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('Authors', null, {}),
};
