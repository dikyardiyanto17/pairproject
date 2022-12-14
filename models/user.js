'use strict';
const bcrypt = require('bcryptjs')
const { Profile } = require("./")

const {
  Model
} = require('sequelize');
const { use } = require('../routes');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // static requirement (option) {

    //   option = {
    //     include: {
    //         model: Profile,
    //         required:true
    //     }
    // }
    //   return User.findAll(option)
    // }

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
        msg : "Namanya jangan kosong dong"
      },
      notEmpty: {
        msg : "Namanya jangan kosong dong"
      }
     }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "Password jangan kosong dong"
        },
        notEmpty: {
          msg : "Password jangan kosong dong"
        },
        len: {
          args: [7,17],
          msg: "Passwordnya harus diantara 7 sampai 17 ya"
     }
       }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "Masa ga punya email"
        },
        notEmpty: {
          msg : "Masa ga punya email"
        },
        isEmail: {
          msg: "Emailmu abal-abal"
        }
       }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, option) => {
        user.role = "user"
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
      }
    }
  });
  return User;
};