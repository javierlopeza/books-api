module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    'Book',
    {
      authorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      datePublished: {
        type: DataTypes.DATE,
      },
      description: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      scopes: {
        withAuthor: () => ({
          include: [{ model: sequelize.models.Author, as: 'author' }],
        }),
      },
    },
  );

  Book.associate = (models) => {
    Book.belongsTo(models.Author, { as: 'author', foreignKey: 'authorId' });
  };

  return Book;
};
