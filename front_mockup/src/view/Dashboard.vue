<template>
   
    <div class="dashboard-container">
      <!-- Sidebar -->
      <Sidebar :userRole="userRole" />
      
      
      <!-- Main content area -->
      <div class="main-content-area">
        <Topbar :userEmail="userEmail" :userRole="userRole" @logout="logout" />
        
        <main class="content-wrapper">
          <router-view />
        </main>
      </div>
    </div>

</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import Topbar from '../components/Topbar.vue';
import authService from '../services/authService';


export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    Topbar,
   
  },
  data() {
    return {
      userRole: '',
      userEmail: ''
    };
  },
  mounted() {
    const user = authService.getCurrentUser();
    console.log('Usuario en mounted:', user); // Debug
    
    if (!user?.token) {
      console.warn('Redirigiendo a login - Token no encontrado');
      this.$router.push('/login');
      return; // ¡Importante! Detiene la ejecución
    }

    // Solo si hay token
    this.userRole = user.role;
    this.userEmail = user.email;
   
    
  },
  methods: {
    logout() {
      authService.logout();
      this.$router.push('/login');
    },

  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Sidebar fijo */
.sidebar {
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
}

/* Área principal */
.main-content-area {
  margin-left: 250px;
  width: calc(100vw - 250px);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Contenido principal */
.content-wrapper {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  margin-top: 60px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

/* Responsive para tablets */
@media (max-width: 992px) {
  .sidebar {
    width: 220px;
  }
  .main-content-area {
    margin-left: 220px;
    width: calc(100vw - 220px);
  }
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .main-content-area {
    margin-left: 0;
    width: 100vw;
  }
  
  .content-wrapper {
    margin-top: 60px;
    height: calc(100vh - 60px);
  }
}
</style>