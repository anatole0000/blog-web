import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import BlogPost from '../components/BlogPost.vue';
import AnalyticsDashboard from '../components/AnalyticsDashboard.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/blog', component: BlogPost },
  { path: '/analytics', component: AnalyticsDashboard},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
