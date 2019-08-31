const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: [6],
        },
      },
    },
    {
      hooks: {
        async beforeSave(instance) {
          if (instance.changed('password')) {
            instance.set('password', await bcrypt.hash(instance.password, 10));
          }
        },
      },
    },
  );

  User.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
