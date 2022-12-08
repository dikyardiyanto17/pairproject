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
          msg: "Terus aku manggil kamu apa?"
        },
        notEmpty: {
          msg: "Terus aku manggil kamu apa?"
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
          msg: "Kamu cowo apa cewe?"
        },
        notEmpty: {
          msg: "Kamu cowo apa cewe?"
        },
        isIn: {
          args: [["Cowo", "Cewe"]],
          msg: "Bencong ya?"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  Profile.beforeCreate((profile)=> {
    profile.phone = profile.formatPhone()
    if (!profile.photo){
      profile.photo = "https://dl.kaskus.id/encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQrHf3nLIogwhbdUPEfKdlkQAG9BfkifF_ImfvxsOhJDctgAYJa"
    }
    if (!profile.bio){
      profile.bio = "Aku males ngisi bio"
    }
  })
  return Profile;
};