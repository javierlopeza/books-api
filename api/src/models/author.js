module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    'Author',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {},
  );

  Author.associate = (models) => {
    Author.hasMany(models.Book, { as: 'books', foreignKey: 'authorId' });
  };

  return Author;
};
