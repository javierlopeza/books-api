const bcrypt = require('bcrypt');
const { internet } = require('faker');
const { range } = require('lodash');

module.exports = {
  up: async (queryInterface) => {
    const usersData = await Promise.all(
      range(100).map(async () => ({
        email: internet.email(),
        password: await bcrypt.hash(internet.password(), 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    );
    return queryInterface.bulkInsert('Users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
