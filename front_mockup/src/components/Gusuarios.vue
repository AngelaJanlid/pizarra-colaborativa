<template>
  <div>
    <h2>Gestión de Usuarios</h2>
    <div class="gestion-usuarios">
      <button 
        @click="mostrarFormulario = !mostrarFormulario" 
        class="btn btn-outline-primary mb-3"
      >
        {{ mostrarFormulario ? 'Cancelar' : 'Agregar Usuario' }}
      </button>

      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Fila del formulario -->
          <tr v-if="mostrarFormulario" class="bg-light">
            <td>
              <input 
                v-model="usuario.email" 
                placeholder="Email"
                class="form-control"
              />
            </td>
            <td>
              <select 
                v-model="usuario.role" 
                class="form-select"
              >
                <option value="admin">Admin</option>
                <option value="user">Usuario</option>
              </select>
            </td>
            <td>
              <button 
                @click="guardarUsuario" 
                class="btn btn-success me-2"
              >
                {{ usuario.id ? 'Actualizar' : 'Guardar' }}
              </button>
              <button 
                @click="cancelarEdicion" 
                class="btn btn-secondary"
              >
                Cancelar
              </button>
            </td>
          </tr>

          <!-- Filas de usuarios -->
          <tr v-for="user in usuarios" :key="user.id">
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button 
                @click="editarUsuario(user)" 
                class="btn btn-warning me-2"
              >
                Editar
              </button>
              <button 
                @click="eliminarUsuario(user.id)" 
                class="btn btn-danger"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import userService from '../services/userService.js';

export default {
  name: 'Gusuarios',
  data() {
    return {
      usuarios: [],
      usuario: {
        id: null,
        email: '',
        password: '',
        role: 'user' // Valor por defecto
      },
      mostrarFormulario: false
    };
  },
  methods: {
    async obtenerUsuarios() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        this.usuarios = await userService.getAllUsers(token);
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async guardarUsuario() {
      try {
        if (this.usuario.id) {
          await userService.updateUser(this.usuario.id, this.usuario);
        } else {
          await userService.createUser(this.usuario);
        }
        this.obtenerUsuarios();
        this.cancelarEdicion();
      } catch (error) {
        console.error('Error al guardar usuario:', error);
      }
    },
    editarUsuario(user) {
      this.usuario = { ...user, password: '' };
      this.mostrarFormulario = true;
      // Scroll a la parte superior para ver el formulario
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async eliminarUsuario(id) {
      if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
          await userService.deleteUser(id);
          this.obtenerUsuarios();
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
        }
      }
    },
    cancelarEdicion() {
      this.usuario = { id: null, email: '', password: '', role: 'user' };
      this.mostrarFormulario = false;
    }
  },
  mounted() {
    this.obtenerUsuarios();
  }
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
  