// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Get top posts for the week
router.get('/top-posts', async (req, res) => {
  try {
    // Assuming you have a `createdAt` field on your posts
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const posts = await Post.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo } } },
      { $sort: { views: -1 } }, // Assuming `views` is a field that tracks post views
      { $limit: 5 } // Get top 5 posts
    ]);
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top posts' });
  }
});

// Get most active users for the week
router.get('/active-users', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const users = await User.aggregate([
      { $match: { lastActive: { $gte: oneWeekAgo } } },
      { $sort: { activityCount: -1 } }, // Assuming `activityCount` tracks user activity
      { $limit: 5 } // Get top 5 most active users
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching active users' });
  }
});

module.exports = router;
