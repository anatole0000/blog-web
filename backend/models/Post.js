// models/BlogPost.js
const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String, // or ObjectId if you have user references
  createdAt: { type: Date, default: Date.now },
  reactions: {
    thumbsUp: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    // Add more reactions as needed
  }
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
