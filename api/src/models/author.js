module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    'Author',
    {
      name: DataTypes.STRING,
    },
    {},
  );

  Author.associate = (models) => {
    Author.hasMany(models.Book, { as: 'books', foreignKey: 'authorId' });
  };

  return Author;
};
