const blogRepository = require('../repositories/blogRepository');

class BlogService {
  /**
   * Get all blogs with pagination and filters
   */
  async getAllBlogs({ page = 1, limit = 6, search = '', topic = '' }) {
    try {
      const { data, total } = await blogRepository.findAll({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        topic
      });

      const totalPages = Math.ceil(total / limit);
      const currentPage = parseInt(page);

      return {
        data,
        pagination: {
          currentPage,
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1
        }
      };
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  /**
   * Get single blog by ID with details
   */
  async getBlogById(id) {
    try {
      const blog = await blogRepository.findById(id);

      if (!blog) {
        return null;
      }

      // Fetch blog details if available
      const details = await blogRepository.findDetailsByBlogId(id);

      return {
        ...blog,
        details: details || null
      };
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  /**
   * Get all unique topics
   */
  async getAllTopics() {
    try {
      const topics = await blogRepository.findAllTopics();

      return {
        topics,
        count: topics.length
      };
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  /**
   * Search blogs by query
   */
  async searchBlogs(searchQuery) {
    try {
      if (!searchQuery || searchQuery.trim() === '') {
        return {
          data: [],
          message: 'Please provide a search query',
          query: searchQuery,
          count: 0
        };
      }

      const results = await blogRepository.search(searchQuery.trim());

      return {
        data: results,
        query: searchQuery,
        count: results.length
      };
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }
}

module.exports = new BlogService();
