const blogService = require('../services/blogService');

// GET /api/blogs - List all blogs with pagination, search, and topic filter
getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = '', topic = '' } = req.query;
    
    const result = await blogService.getAllBlogs({ page, limit, search, topic });
    
    res.json(result);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blogs', 
      message: error.message 
    });
  }
};

// GET /api/blogs/:id - Get single blog post with details
getBlogById = async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    
    if (isNaN(blogId)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    const blog = await blogService.getBlogById(blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blog', 
      message: error.message 
    });
  }
};

// GET /api/blogs/topics - Get all unique topics
getTopics = async (req, res) => {
  try {
    const result = await blogService.getAllTopics();
    res.json(result);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch topics', 
      message: error.message 
    });
  }
};

// GET /api/blogs/search?q= - Search blogs
searchBlogs = async (req, res) => {
  try {
    const { q = '' } = req.query;
    
    const result = await blogService.searchBlogs(q);
    
    res.json(result);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ 
      error: 'Search failed', 
      message: error.message 
    });
  }
};

module.exports = { getAllBlogs, getBlogById, getTopics, searchBlogs }