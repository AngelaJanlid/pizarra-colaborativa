<template>
  <div class="sidebar-container">
    <div class="sidebar-header">
      <div class="logo" style="text-align: center;">
        <img
          src="../assets/images/marca2.png"
          alt="Marca"
          class="rounded-circle m-2"
          width="150"
          height="150"
        />
      </div>
    </div>

    <div class="sidebar-content">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link 
            class="nav-link hover-scale text-white fw-bold p-3" 
            to="/dashboard"
            active-class="active-link"
          >
            <i class="fas fa-home me-2"></i> Inicio
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
            class="nav-link hover-scale text-white fw-bold p-3" 
            :to="{ name: 'Editor', query: { editing: 'false' } }"
            @click="limpiarMockupId"
            active-class="active-link"
          >
            <i class="fas fa-chalkboard me-2"></i> Pizarra
          </router-link>
        </li>
        <li v-if="userRole === 'user'" class="nav-item">
          <router-link 
            class="nav-link hover-scale text-white fw-bold p-3" 
            to="/dashboard/gmuckops"
            active-class="active-link"
          >
            <i class="fas fa-chalkboard me-2"></i> Mis Diagramas
          </router-link>
        </li>
        
        

        <li v-if="userRole === 'admin'" class="nav-item">
          <router-link 
            class="nav-link btn btn-outline-primary text-white" 
            to="/dashboard/gusuarios"
            active-class="active-link"
          >
            <i class="fas fa-users-cog me-2"></i> Gestión de Usuarios
          </router-link>
        </li>
        <li v-if="userRole === 'admin'" class="nav-item">
          <router-link 
            class="nav-link btn btn-outline-primary text-white" 
            to="/dashboard/gmuckops"
            active-class="active-link"
          >
            <i class="fas fa-users-cog me-2"></i> Gestión de Mockups
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
  props: ['userRole', 'editorInstance'],
  data() {
    return {
      showDiagramMenu: false
    }
  },
  methods: {
    toggleDiagramMenu() {
      this.showDiagramMenu = !this.showDiagramMenu;
    },
    limpiarMockupId() {
    localStorage.removeItem('currentMockup');
  },

    
    mostrarNotificacion(titulo, mensaje, tipo) {
      // Implementa tu sistema de notificaciones aquí
      console.log(`[${tipo}] ${titulo}: ${mensaje}`);
      // O usa tu librería de notificaciones (ej: toast, snackbar, etc.)
    }
    
  }
};
</script>

<style scoped>
.sidebar-container {
  width: 250px;
  height: 100vh;
  background-color: #2D336B;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  border-radius: 5px;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.active-link {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.dropdown-menu {
  background-color: #3a427a;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin-top: 0;
  width: 100%;
}

.dropdown-item {
  color: white;
  padding: 0.5rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #4a5494;
}

.file-input-label {
  position: relative;
  margin: 0;
}

.file-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.dropdown-divider {
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-outline-primary {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline-primary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Scrollbar personalizada */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>