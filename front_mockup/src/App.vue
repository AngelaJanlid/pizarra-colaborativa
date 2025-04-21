<script setup>
import { RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
</script>

<template>
  <div :class="{ dashboardLayout: isDashboard }" id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    isDashboard() {
      return this.$route.path.startsWith('/dashboard') || this.$route.path === '/user';
    }
  }
};
</script>

