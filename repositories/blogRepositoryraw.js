const db = require('../config/database');

class BlogRepository {
  /**
   * Get all blogs with pagination and filters
   */
  async findAll({ page = 1, limit = 6, search = '', topic = '' }) {
    try {
      let query = `
        SELECT DISTINCT
          b.id, b.title, b.excerpt, b.date, b.category, b.read_time,
          GROUP_CONCAT(DISTINCT t.name ORDER BY t.name) as topics
        FROM blogs b
        LEFT JOIN blog_topics bt ON b.id = bt.blog_id
        LEFT JOIN topics t ON bt.topic_id = t.id
      `;

      const conditions = [];
      const params = [];

      // Search filter
      if (search) {
        conditions.push('(b.title LIKE ? OR b.excerpt LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }

      // Topic filter
      if (topic) {
        conditions.push('t.name = ?');
        params.push(topic);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' GROUP BY b.id, b.title, b.excerpt, b.date, b.category, b.read_time';
      query += ' ORDER BY b.date DESC';

      // Get total count
      const countQuery = `SELECT COUNT(DISTINCT b.id) as total FROM blogs b
        LEFT JOIN blog_topics bt ON b.id = bt.blog_id
        LEFT JOIN topics t ON bt.topic_id = t.id
        ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`;
      
      const [[{ total }]] = await db.query(countQuery, params);

      // Pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      const [rows] = await db.query(query, params);

      // Convert topics string to array
      const blogs = rows.map(blog => ({
        ...blog,
        topics: blog.topics ? blog.topics.split(',') : []
      }));

      return {
        data: blogs,
        total: parseInt(total)
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
      const query = `
        SELECT 
          b.id, b.title, b.excerpt, b.date, b.category, b.read_time,
          GROUP_CONCAT(DISTINCT t.name ORDER BY t.name) as topics
        FROM blogs b
        LEFT JOIN blog_topics bt ON b.id = bt.blog_id
        LEFT JOIN topics t ON bt.topic_id = t.id
        WHERE b.id = ?
        GROUP BY b.id, b.title, b.excerpt, b.date, b.category, b.read_time
      `;

      const [rows] = await db.query(query, [id]);

      if (rows.length === 0) {
        return null;
      }

      const blog = {
        ...rows[0],
        topics: rows[0].topics ? rows[0].topics.split(',') : []
      };

      return blog;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  /**
   * Find blog details by blog ID
   */
  async findDetailsByBlogId(blogId) {
    try {
      const query = 'SELECT content FROM blog_details WHERE blog_id = ?';
      const [rows] = await db.query(query, [blogId]);

      if (rows.length === 0) {
        return null;
      }

      return rows[0].content;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  /**
   * Get all unique topics
   */
  async findAllTopics() {
    try {
      const query = 'SELECT name FROM topics ORDER BY name';
      const [rows] = await db.query(query);
      return rows.map(row => row.name);
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  /**
   * Search blogs by query
   */
  async search(searchQuery) {
    try {
      const query = `
        SELECT DISTINCT
          b.id, b.title, b.excerpt, b.date, b.category, b.read_time,
          GROUP_CONCAT(DISTINCT t.name ORDER BY t.name) as topics
        FROM blogs b
        LEFT JOIN blog_topics bt ON b.id = bt.blog_id
        LEFT JOIN topics t ON bt.topic_id = t.id
        WHERE b.title LIKE ? 
          OR b.excerpt LIKE ? 
          OR b.category LIKE ?
          OR t.name LIKE ?
        GROUP BY b.id, b.title, b.excerpt, b.date, b.category, b.read_time
        ORDER BY b.date DESC
      `;

      const searchParam = `%${searchQuery}%`;
      const [rows] = await db.query(query, [searchParam, searchParam, searchParam, searchParam]);

      const blogs = rows.map(blog => ({
        ...blog,
        topics: blog.topics ? blog.topics.split(',') : []
      }));

      return blogs;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
}

module.exports = new BlogRepository();
