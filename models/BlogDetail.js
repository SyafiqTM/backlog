const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogDetail = sequelize.define('BlogDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'blog_id'
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'blog_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BlogDetail;
