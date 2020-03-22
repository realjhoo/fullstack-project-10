const Sequelize = require("sequelize");

module.exports = sequelize => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter a valid firstName."
          }
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter a valid lastName."
          }
        }
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Email address cannot be empty."
          },
          isEmail: {
            msg: "Please enter a valid email address."
          }
        },
        unique: {
          args: true,
          msg: "Email address is already in use."
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter a password."
          }
        }
      }
    },
    { sequelize }
  );

  User.associate = models => {
    User.hasMany(models.Course, {
      as: "userInfo",
      foreignKey: {
        fieldName: "userId",
        allowNull: false
      }
    });
  };

  return User;
};
