const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');

// GET /api/blogs - List all blogs with pagination and filters
router.get('/', blogsController.getAllBlogs);

// GET /api/blogs/topics - Get all unique topics
router.get('/topics', blogsController.getTopics);

// GET /api/blogs/search - Search blogs
router.get('/search', blogsController.searchBlogs);

// GET /api/blogs/:id - Get single blog by ID
router.get('/:id', blogsController.getBlogById);

module.exports = router;
