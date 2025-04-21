<template>
    <div>
      <h2>Mis Mockups</h2>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th  v-if="userRole === 'admin'">Usuario</th> 
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>   
            <!-- Filas de usuarios -->
            <tr v-for="mockup in mockups " :key="mockup.id">
              <td>{{ mockup.name }}</td>
              <td>{{ (mockup.createAt) }}</td>
               <!-- Columna de Usuario -->
              <td v-if="userRole === 'admin'">{{ mockup.user?.email}}</td>
              <td>
                <button 
                  @click="editarMockups(mockup.id, mockup.data)" 
                  class="btn btn-warning me-2"
                >
                  Editar
                </button>
                <button 
                  @click="eliminarMockup(mockup.id)" 
                  class="btn btn-danger"
                >
                  Eliminar
                </button>
         
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </template>
  
  <script>
  import mockupService from '../services/editor/mockupService';
  
  
  export default {
    name: 'Gmockups',
    data() {
      return {
        mockups: [],
        userRole: JSON.parse(localStorage.getItem('user'))?.role || '',
        data: {
          id: null,
          name: '',
          password: '',
          data: null,
          userId: null,
          role: 'user' 
        },
        mostrarFormulario: false
      };
    },

    mounted() {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Usuario cargado desde localStorage:', user);
  if (!user || !user.role) {
    console.warn('Usuario no encontrado o sin rol definido. Redirigiendo al dashboard.');
    this.$router.push('/dashboard');
    return;
  }

  // Verifica el rol del usuario
  if (user.role === 'admin') {
    console.log('Usuario administrador detectado. Cargando todos los mockups.');
    this.obtenerTodasLasMockups();
  } else {
    console.log('Usuario normal detectado. Cargando mockups del usuario.');
    this.obtenerMockupsUser();
  }
    },

    
  methods: {
//--|--se encarga de formatear la fecha y mostrar un mensaje temporal si es una promesa
//--|--
  async formatDate(dateValue) {
      // Si es una Promesa, devuelve mensaje temporal
      if (dateValue && typeof dateValue.then === 'function') {
        return 'Cargando fecha...';
      }
      
      // Si no es una fecha válida
      if (!dateValue || isNaN(new Date(dateValue))) {
        return 'Sin fecha';
      }
      
      // Formateo de fecha normal
      return new Date(dateValue).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  },

//---|--se encarga de obtener los mockups del usuario y asignarlos a la variable mockup
//---|--
  async obtenerMockupsUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo al dashboard.');
      this.$router.push('/dashboard');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      console.warn('Usuario no encontrado en localStorage. Redirigiendo al dashboard.');
      this.$router.push('/dashboard');
      return;
    }

    const userId = user.id;

    console.log(`Obteniendo mockups para el usuario con ID: ${userId}`);

    const response = await mockupService.obtenerMockupPorUser(userId, token);

    // Asignar los datos a this.mockup
    this.mockups = response.data || [];
    console.log('Mockups asignados a la variable:', this.mockup);

    // Validar si la respuesta contiene datos
    if (this.mockups.length === 0) {
      console.log('El usuario no tiene mockups.');
    }
  } catch (error) {
    console.error('Error al obtener los mockups del usuario:', error);
  }
},
//-------------cargar todos los mockups----------------

async obtenerTodasLasMockups() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo al dashboard.');
      this.$router.push('/dashboard');
      return;
    }

    console.log('Obteniendo todas las mockups para el administrador.');

    const response = await mockupService.obtenerMockups(token);

    // Verifica los datos devueltos por la API
    console.log('Datos devueltos por la API:', response);

    if (!response || !response.data) {
      console.error('La respuesta de la API no contiene datos.');
      return;
    }

    // Asignar los datos a this.mockups
    this.mockups = response.data.map(mockup => ({
      ...mockup,
      createAt: mockup.createAt
        ? new Date(mockup.createAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Sin fecha',
    }));

    console.log('Todas las mockups cargadas:', this.mockups);

    if (this.mockups.length === 0) {
      console.log('No hay mockups disponibles.');
    }
  } catch (error) {
    console.error('Error al obtener todas las mockups:', error);
  }
},
//--|--se encarga de eliminar el mockup y redirigir al editor
//--|--


      
      async eliminarMockup(id){
        if (confirm('¿Estas seguro de eliminar este mockup?')){
          try{
            const token = localStorage.getItem('token');
            await mockupService.eliminarMockup(id, token);
            if (this.userRole === 'admin') {
              this.obtenerTodasLasMockups();
            } else {
              this.obtenerMockupsUser();
            }
          }catch(error){
            console.error('Error al eliminar mockup:', error);
            throw error;
          }
          
        }
      },

    cancelarEdicion() {
      this.mockups = { 
        id: null, 
        name: '', 
        description: '', 
        data: null, 
        userId: null 
      };
      this.mostrarFormulario = false;
    },


//--------se encarga de editar el mockup y redirigir al editor
//----------
    async editarMockups(mockupId, mockupData) {
  try {
    // 1. Validación de token
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }

    // 2. Validación de datos básicos
    if (!mockupId) {
      throw new Error('ID de mockup no proporcionado');
    }

    // 3. Preparación de datos para el editor
    const mockupName = this.mockups.find(m => m.id === mockupId)?.name || '';
    const editorPayload = {
      id: mockupId,
      data: mockupData,
      name: mockupName
    };

    // 4. Almacenamiento temporal (mejorado)
    localStorage.setItem('currentMockup', JSON.stringify(editorPayload));

    // 5. Navegación al editor (versión más robusta)
    await this.$router.push({
      name: 'Editor',
      params: { 
        id: mockupId
      },
      query: {
        editing: 'true' // Parámetro útil para el componente Editor
      }
    });

  } catch(error) {
    console.error('Error al preparar edición:', error);
    // Opcional: Redirigir a una vista segura
    this.$router.push('/dashboard').catch(() => {});
  }
},


      async descargarMockup(mockupId) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.$router.push('/login');
            return;
          }

          const response = await mockupService.descargarMockup(mockupId, token);
          const blob = new Blob([response.data], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${mockupId}.json`;
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error al descargar mockup:', error);
        }
      }
  },



  
  };
  </script>
  
  <style scoped>
  .gestion-usuarios {
    padding: 20px;
  }
  
  /* Estilo para la fila del formulario */
  tr.bg-light {
    background-color: #f8f9fa !important;
  }
  
  /* Espaciado entre botones */
  .btn {
    margin-right: 5px;
  }
  
  /* Ajustes para inputs en la tabla */
  .form-control, .form-select {
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
  }
  </style>
    