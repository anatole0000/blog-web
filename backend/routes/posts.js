const express = require('express');
const BlogPost = require('../models/Post');
const router = express.Router();

// Middleware to check if the user is authenticated
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

// Get reactions for a specific post
router.get('/:postId/reactions', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post.reactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reactions' });
  }
});

// React to a post (thumbsUp, heart, laugh, sad)
router.post('/:postId/reactions', isAuth, async (req, res) => {
  const { reactionType } = req.body; // thumbsUp, heart, laugh, sad

  if (!['thumbsUp', 'heart', 'laugh', 'sad'].includes(reactionType)) {
    return res.status(400).json({ error: 'Invalid reaction type' });
  }

  try {
    const post = await BlogPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment the reaction count for the specific reaction type
    post.reactions[reactionType] += 1;
    await post.save();

    res.json({ message: 'Reaction added', reactions: post.reactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

module.exports = router;
