const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Post a new comment
router.post('/:postId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { content } = req.body;
  const postId = req.params.postId;
  const comment = new Comment({
    postId,
    content,
    author: req.session.user.username,
    createdAt: new Date(),
  });

  try {
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// Edit a comment
router.put('/:commentId', auth, async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author !== req.session.user.username) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    comment.content = content;
    await comment.save();

    res.json({ message: 'Comment updated successfully', comment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete a comment
router.delete('/:commentId', auth, async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author !== req.session.user.username) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    await comment.remove();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
