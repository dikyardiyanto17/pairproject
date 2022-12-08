'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    formatPhone() {
      return `+62${this.phone}`
    }
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        onDelete: 'CASCADE'
      })
      Profile.hasMany(models.Post)
    }
  }
  Profile.init({
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is empty"
        },
        notEmpty: {
          msg: "Name is empty"
        }
      }
    },
    photo: DataTypes.TEXT,
    bio: DataTypes.TEXT,
    phone: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Gender is required"
        },
        notEmpty: {
          msg: "Gender is required"
        },
        isIn: {
          args: [["Male", "Female"]],
          msg: "Must be either female or male"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  Profile.beforeCreate((profile)=> {
    profile.phone = profile.formatPhone()
  })
  return Profile;
};