<template>
    <div>
      <h2>All Blog Posts</h2>
  
      <form @submit.prevent="submitPost">
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
        editContent: ''
      };
    },
    async created() {
      await this.loadUser();
      await this.loadPosts();
    },
    methods: {
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
      }
    }
  };
  </script>
  
  <style>
  .post {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px 0;
  }
  input, textarea {
    display: block;
    width: 100%;
    margin-bottom: 5px;
  }
  button {
    margin-right: 5px;
  }
  </style>
  <style scoped>
  /* Blog Section */
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  form input,
  form textarea {
    padding: 10px;
    margin: 10px 0;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
  }
  
  form button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  form button:hover {
    background-color: #45a049;
  }
  
  /* Post Cards */
  .post {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .post h3 {
    margin-top: 0;
    font-size: 1.6rem;
    color: #333;
  }
  
  .post p {
    color: #555;
    font-size: 1.1rem;
  }
  
  .post small {
    font-size: 0.9rem;
    color: #888;
  }
  
  .post .buttons {
    margin-top: 10px;
  }
  
  button {
    background-color: #007BFF;
    color: white;
    padding: 8px 15px;
    margin-right: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  /* Edit/Delete Form */
  textarea,
  input {
    margin-bottom: 10px;
    font-size: 1.1rem;
    padding: 10px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  /* Save and Cancel Button */
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  /* Responsive Design */
  @media (max-width: 600px) {
    .post {
      padding: 10px;
    }
    
    form {
      padding: 15px;
    }
  
    button {
      width: 100%;
      margin-bottom: 10px;
    }
  }
  </style>
  