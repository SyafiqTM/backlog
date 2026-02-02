const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogTopic = sequelize.define('BlogTopic', {
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'blog_id'
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'topic_id'
  }
}, {
  tableName: 'blog_topics',
  timestamps: false
});

module.exports = BlogTopic;
