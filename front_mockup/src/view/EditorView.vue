<template>
    <div class="dashboard-editor-view">
      <h1 class="editor-title">Editor de Mockups</h1>
      <div class="editor-wrapper">
        <GrapesEditor :token="userToken" @saved="showSuccess" />
      </div>
    </div>
  </template>
  
  <script>
  import GrapesEditor from '../components/Grapes/GrapesEditor.vue';
  
  export default {
    components: { GrapesEditor },
    data() {
      return {
        userToken: localStorage.getItem('token'),
        mockupId: null
      };
    },

    created(){
          // Obtiene el ID de los parámetros de la ruta
        this.mockupEditId = this.$route.params.id || this.$route.query.id;
        
        // Si no viene por ruta, intenta obtenerlo de localStorage
        if (!this.mockupEditId) {
          const savedMockup = localStorage.getItem('currentMockup');
          if (savedMockup) {
            this.mockupEditId = JSON.parse(savedMockup).id;
          }
        }
    },

    methods: {
      showSuccess() {
        this.$notify({
        title: 'Éxito',
        message: 'Mockup guardado correctamente!',
        type: 'success'
      });
      }
    }
  };
  </script>
  
  <style scoped>
  .dashboard-editor-view {
    margin-bottom: 5px;
    height: calc(100vh - 60px); /* Ajusta según la altura de tu navbar */
  }
  
  .editor-title {
    margin-bottom: 5px;
    color: #2D336B;
  }
  
  .editor-wrapper {
    height: 100%; /* Asegúrate de que ocupe todo el espacio disponible */
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden; /* Evita que el contenido se desborde */
  }
  </style>