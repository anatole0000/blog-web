<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserRegister',
    data() {
      return {
        username: '',
        email: '',
        password: ''
      };
    },
    methods: {
      async register() {
        try {
          await axios.post('http://localhost:5000/auth/register', {
            username: this.username,
            email: this.email,
            password: this.password
          });
          this.$router.push('/login');
        } catch (err) {
          alert('Error registering user');
        }
      }
    }
  };
  </script>
  