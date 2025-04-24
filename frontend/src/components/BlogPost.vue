<template>
  <div :class="theme">
    <div class="theme-toggle">
      <button @click="toggleTheme">{{ theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}</button>
    </div>
    <h2>All Blog Posts</h2>

    <form @submit.prevent="submitPost" class="post-form">
      <input v-model="title" placeholder="Title" />
      <textarea v-model="content" placeholder="Content"></textarea>
      <button type="submit">Post</button>
    </form>

    <div v-for="post in posts" :key="post._id" class="post">
      <div v-if="editId === post._id">
        <input v-model="editTitle" />
        <textarea v-model="editContent"></textarea>
        <button @click="saveEdit(post._id)">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
      <div v-else>
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <small>By {{ post.author }} | {{ formatDate(post.createdAt) }}</small>
        <div v-if="post.author === user">
          <button @click="startEdit(post)">Edit</button>
          <button @click="deletePost(post._id)">Delete</button>
        </div>

        <div class="comments">
          <h4>Comments</h4>
          <div v-for="comment in comments[post._id]" :key="comment._id" class="comment">
            <p v-if="!comment.editing">
              <strong>{{ comment.author }}:</strong> {{ comment.content }}
              <span v-if="comment.author === user">
                <button @click="startCommentEdit(post._id, comment)">Edit</button>
                <button @click="deleteComment(post._id, comment._id)">Delete</button>
              </span>
            </p>

            <div v-else>
              <textarea v-model="comment.editContent"></textarea>
              <button @click="saveCommentEdit(post._id, comment._id)">Save</button>
              <button @click="cancelCommentEdit(post._id, comment)">Cancel</button>
            </div>
          </div>

          <div v-if="user">
            <input v-model="newComments[post._id]" placeholder="Write a comment..." />
            <button @click="submitComment(post._id)">Comment</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      title: '',
      content: '',
      posts: [],
      user: '',
      editId: null,
      editTitle: '',
      editContent: '',
      comments: {},        // postId => array of comments
      newComments: {},     // postId => new comment text
      theme: 'light',      // Theme is set to 'light' by default
    };
  },
  async created() {
    await this.loadUser();
    await this.loadPosts();
    this.loadTheme();
  },
  methods: {
    // Toggle theme between dark and light
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme); // Save the theme preference
    },

    // Load the theme from localStorage
    loadTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.theme = savedTheme;
      }
    },

    async loadUser() {
      try {
        const res = await axios.get('http://localhost:5000/auth/check', { withCredentials: true });
        this.user = res.data.username;
      } catch (err) {
        this.user = '';
      }
    },
    
    async loadPosts() {
      const res = await axios.get('http://localhost:5000/blog', { withCredentials: true });
      this.posts = res.data;
      for (const post of this.posts) {
        await this.loadComments(post._id);
      }
    },

    async loadComments(postId) {
      const res = await axios.get(`http://localhost:5000/comments/${postId}`, { withCredentials: true });
      this.comments[postId] = res.data;
      this.newComments[postId] = '';
    },

    async submitComment(postId) {
      const content = this.newComments[postId];
      if (!content) return;
      await axios.post(`http://localhost:5000/comments/${postId}`, { content }, { withCredentials: true });
      this.newComments[postId] = '';
      this.loadComments(postId);
    },

    async submitPost() {
      await axios.post('http://localhost:5000/blog', {
        title: this.title,
        content: this.content
      }, { withCredentials: true });
      this.title = '';
      this.content = '';
      this.loadPosts();
    },

    startEdit(post) {
      this.editId = post._id;
      this.editTitle = post.title;
      this.editContent = post.content;
    },

    cancelEdit() {
      this.editId = null;
      this.editTitle = '';
      this.editContent = '';
    },

    async saveEdit(id) {
      await axios.put(`http://localhost:5000/blog/${id}`, {
        title: this.editTitle,
        content: this.editContent
      }, { withCredentials: true });
      this.cancelEdit();
      this.loadPosts();
    },

    async deletePost(id) {
      await axios.delete(`http://localhost:5000/blog/${id}`, { withCredentials: true });
      this.loadPosts();
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },

    startCommentEdit(postId, comment) {
      comment.editing = true;
      comment.editContent = comment.content;
    },

    cancelCommentEdit(postId, comment) {
      comment.editing = false;
      comment.editContent = '';
    },

    async saveCommentEdit(postId, commentId) {
      const comment = this.comments[postId].find(c => c._id === commentId);
      await axios.put(`http://localhost:5000/comments/${commentId}`, { content: comment.editContent }, { withCredentials: true });
      comment.editing = false;
      this.loadComments(postId);
    },

    async deleteComment(postId, commentId) {
      await axios.delete(`http://localhost:5000/comments/${commentId}`, { withCredentials: true });
      this.loadComments(postId);
    }
  }
};
</script>

<style>
/* CSS for light and dark themes */
:root {
  --background-color-light: #ffffff;
  --text-color-light: #000000;
  --background-color-dark: #333333;
  --text-color-dark: #ffffff;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.theme {
  background-color: var(--background-color-light);
  color: var(--text-color-light);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.theme.dark {
  background-color: var(--background-color-dark);
  color: var(--text-color-dark);
}

/* Post Form */
.post-form {
  margin-bottom: 20px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

/* Comments */
.comments {
  margin-top: 20px;
}

.comment {
  background: #f4f4f4;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.comment button {
  margin-left: 10px;
  background-color: #FF6F61;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.comment button:hover {
  background-color: #FF4B38;
}

/* Responsive Layout */
@media (max-width: 768px) {
  .post-form input,
  .post-form textarea {
    font-size: 14px;
  }
  .comment {
    padding: 5px;
    font-size: 14px;
  }
}

/* Button Styles for Theme Toggle */
.theme-toggle button {
  margin: 20px;
  background-color: #008CBA;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>
