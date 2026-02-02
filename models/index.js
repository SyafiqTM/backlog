const sequelize = require('../config/database');
const Blog = require('./Blog');
const Topic = require('./Topic');
const BlogTopic = require('./BlogTopic');
const BlogDetail = require('./BlogDetail');

// Define associations

// Blog <-> Topic (Many-to-Many through BlogTopic)
Blog.belongsToMany(Topic, {
  through: BlogTopic,
  foreignKey: 'blog_id',
  otherKey: 'topic_id',
  as: 'topics'
});

Topic.belongsToMany(Blog, {
  through: BlogTopic,
  foreignKey: 'topic_id',
  otherKey: 'blog_id',
  as: 'blogs'
});

// Blog -> BlogDetail (One-to-One)
Blog.hasOne(BlogDetail, {
  foreignKey: 'blog_id',
  as: 'details'
});

BlogDetail.belongsTo(Blog, {
  foreignKey: 'blog_id'
});

module.exports = {
  sequelize,
  Blog,
  Topic,
  BlogTopic,
  BlogDetail
};
