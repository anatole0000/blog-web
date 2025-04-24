<template>
    <nav class="navbar">

      <router-link class="nav-link" to="/blog">Blog</router-link>
      <li><router-link to="/analytics">Analytics</router-link></li>
      <div class="auth-links">
        <router-link v-if="!isLoggedIn" class="nav-link" to="/login">Login</router-link>
        <router-link v-if="!isLoggedIn" class="nav-link" to="/register">Register</router-link>
        <button v-if="isLoggedIn" class="nav-button" @click="logout">Logout</button>
      </div>
    </nav>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'BlogNavbar',
    data() {
      return {
        isLoggedIn: false
      };
    },
    async created() {
      await this.checkAuth();
    },
    methods: {
      async checkAuth() {
        try {
          const res = await axios.get('http://localhost:5000/auth/check', { withCredentials: true });
          this.isLoggedIn = res.data.loggedIn;
        } catch (err) {
          this.isLoggedIn = false;
        }
      },
      async logout() {
        await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
        this.isLoggedIn = false;
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Navbar Container */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    font-family: 'Arial', sans-serif;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  /* Links and Button */
  .nav-link {
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  .nav-link:hover {
    background-color: #45a049;
  }
  
  .nav-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .nav-button:hover {
    background-color: #d32f2f;
  }
  
  /* Auth Links Wrapper */
  .auth-links {
    display: flex;
    gap: 15px;
  }
  
  /* Responsive Styling */
  @media (max-width: 768px) {
    .navbar {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .auth-links {
      margin-top: 10px;
      flex-direction: column;
    }
  
    .nav-link, .nav-button {
      width: 100%;
      text-align: center;
    }
  }
  </style>
  