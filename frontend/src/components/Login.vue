<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        await axios.post('http://localhost:5000/auth/login', {
          email: this.email,
          password: this.password
        });
        this.$router.push('/blog');
      } catch (err) {
        alert('Invalid login');
      }
    }
  }
};
</script>
