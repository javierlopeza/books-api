module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Authors', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Authors'),
};
