'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
    }
  }
  User.init({
    username: {
     type: DataTypes.STRING,
     unique: true,
     allowNull: false,
     validate: {
      notNull: {
        msg : "Username cannot be empty"
      },
      notEmpty: {
        msg : "Username cannot be empty"
      }
     }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "Password cannot be empty"
        },
        notEmpty: {
          msg : "Password cannot be empty"
        },
        len: {
          args: [7,17],
          msg: "Password character must between 7 and 17"
     }
       }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "Email cannot be empty"
        },
        notEmpty: {
          msg : "Email cannot be empty"
        },
        isEmail: {
          msg: "Email is not valid"
        }
       }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};