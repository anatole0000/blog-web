<template>
    <div>
      <h2>Analytics Dashboard</h2>
  
      <div class="dashboard">
        <!-- Top Posts This Week -->
        <div class="stat-card">
          <h3>Top Posts This Week</h3>
          <ul>
            <li v-for="post in topPosts" :key="post._id">
              {{ post.title }} - {{ post.views }} Views
            </li>
          </ul>
        </div>
  
        <!-- Most Active Users This Week -->
        <div class="stat-card">
          <h3>Most Active Users This Week</h3>
          <ul>
            <li v-for="user in activeUsers" :key="user._id">
              {{ user.username }} - {{ user.activityCount }} Activities
            </li>
          </ul>
        </div>
  
        <!-- Chart Section (optional, using Chart.js) -->
        <div class="chart-section">
          <h3>Post Views This Week</h3>
          <LineChart :chartData="postViewsData" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { Line } from 'vue-chartjs';
  import { reactive, ref, onMounted } from 'vue';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);
  
  export default {
    components: {
      LineChart: Line,
    },
    setup() {
      const topPosts = ref([]);
      const activeUsers = ref([]);
      const postViewsData = reactive({
        labels: [], // Will hold titles or dates
        datasets: [{
          label: 'Views',
          data: [], // Will hold views for corresponding labels
          borderColor: '#42A5F5',
          fill: false,
        }],
      });
  
      onMounted(async () => {
        await loadTopPosts();
        await loadActiveUsers();
        await loadPostViewsChart();
      });
  
      const loadTopPosts = async () => {
        try {
          const res = await axios.get('http://localhost:5000/analytics/top-posts');
          topPosts.value = res.data;
        } catch (error) {
          console.error('Error fetching top posts:', error);
        }
      };
  
      const loadActiveUsers = async () => {
        try {
          const res = await axios.get('http://localhost:5000/analytics/active-users');
          activeUsers.value = res.data;
        } catch (error) {
          console.error('Error fetching active users:', error);
        }
      };
  
      const loadPostViewsChart = async () => {
        try {
          const res = await axios.get('http://localhost:5000/analytics/post-views'); // Example API for chart data
          const posts = res.data;
  
          // Prepare data for chart (simple example with titles and views)
          if (posts && posts.length) {
            postViewsData.labels = posts.map(post => post.title);  // X-axis labels
            postViewsData.datasets[0].data = posts.map(post => post.views);  // Y-axis data (views)
          }
        } catch (error) {
          console.error('Error fetching post views chart data:', error);
        }
      };
  
      return {
        topPosts,
        activeUsers,
        postViewsData,
      };
    },
  };
  </script>
  
  <style scoped>
  .dashboard {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .stat-card {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 300px;
  }
  
  .stat-card h3 {
    margin-bottom: 15px;
  }
  
  .stat-card ul {
    list-style-type: none;
    padding: 0;
  }
  
  .stat-card li {
    margin: 10px 0;
  }
  
  .chart-section {
    width: 100%;
    margin-top: 30px;
  }
  </style>
  