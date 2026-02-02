const { Blog, Topic, BlogDetail } = require('../models');
const { Op } = require('sequelize');

class BlogRepository {
  /**
   * Get all blogs with pagination and filters
   */
  async findAll({ page = 1, limit = 6, search = '', topic = '' }) {
    try {
      const where = {};
      const topicWhere = {};

      // Search filter
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { excerpt: { [Op.like]: `%${search}%` } }
        ];
      }

      // Topic filter
      if (topic) {
        topicWhere.name = topic;
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await Blog.findAndCountAll({
        where,
        include: [{
          model: Topic,
          as: 'topics',
          attributes: ['name'],
          through: { attributes: [] },
          where: Object.keys(topicWhere).length > 0 ? topicWhere : undefined
        }],
        limit: parseInt(limit),
        offset,
        order: [['date', 'DESC']],
        distinct: true
      });

      // Format response
      const blogs = rows.map(blog => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt,
        date: blog.date,
        category: blog.category,
        read_time: blog.read_time,
        topics: blog.topics.map(t => t.name)
      }));

      return {
        data: blogs,
        total: count
      };
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  /**
   * Find blog by ID
   */
  async findById(id) {
    try {
      const blog = await Blog.findByPk(id, {
        include: [{
          model: Topic,
          as: 'topics',
          attributes: ['name'],
          through: { attributes: [] }
        }]
      });

      if (!blog) {
        return null;
      }

      return {
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt,
        date: blog.date,
        category: blog.category,
        read_time: blog.read_time,
        topics: blog.topics.map(t => t.name)
      };
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  /**
   * Find blog details by blog ID
   */
  async findDetailsByBlogId(blogId) {
    try {
      const blogDetail = await BlogDetail.findOne({
        where: { blog_id: blogId }
      });

      if (!blogDetail) {
        return null;
      }

      return blogDetail.content;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  /**
   * Get all unique topics
   */
  async findAllTopics() {
    try {
      const topics = await Topic.findAll({
        attributes: ['name'],
        order: [['name', 'ASC']]
      });

      return topics.map(topic => topic.name);
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  /**
   * Search blogs by query
   */
  async search(searchQuery) {
    try {
      const blogs = await Blog.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } },
            { excerpt: { [Op.like]: `%${searchQuery}%` } },
            { category: { [Op.like]: `%${searchQuery}%` } }
          ]
        },
        include: [{
          model: Topic,
          as: 'topics',
          attributes: ['name'],
          through: { attributes: [] },
          where: {
            name: { [Op.like]: `%${searchQuery}%` }
          },
          required: false
        }],
        order: [['date', 'DESC']]
      });

      return blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt,
        date: blog.date,
        category: blog.category,
        read_time: blog.read_time,
        topics: blog.topics.map(t => t.name)
      }));
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
}

module.exports = new BlogRepository();
