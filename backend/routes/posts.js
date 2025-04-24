const express = require('express');
const BlogPost = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Create a new post
// Middleware: protect routes
const isAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
    next();
  };
  
  // Get all posts
  router.get('/', async (req, res) => {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  });
  
  // Create post (auth required)
  router.post('/', isAuth, async (req, res) => {
    const post = new BlogPost({
      title: req.body.title,
      content: req.body.content,
      author: req.session.username,
      createdAt: new Date()
    });
    await post.save();
    res.status(201).json(post);
  });
  // Update post
router.put('/:id', isAuth, async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author !== req.session.username) return res.status(403).json({ error: 'Unauthorized' });
  
    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    res.json(post);
  });
  
  // Delete post
  router.delete('/:id', isAuth, async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author !== req.session.username) return res.status(403).json({ error: 'Unauthorized' });
  
    await post.deleteOne();
    res.json({ message: 'Deleted successfully' });
  });
  
  module.exports = router;