'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.hasMany(models.PostTag)
      Post.belongsTo(models.Profile, {
        onDelete: 'CASCADE'
      })
      Post.belongsToMany(models.Tag, {through: models.PostTag, onDelete: 'CASCADE'})
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title is empty"
        },
        notEmpty: {
          msg: "Title is empty"
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Content is empty"
        },
        notEmpty: {
          msg: "Content is empty"
        }
      }
    },
    moodStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "What is your mood?"
        },
        notEmpty: {
          msg: "What is your mood?"
        }
      }
    },
    ProfileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};