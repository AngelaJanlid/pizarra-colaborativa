<template>
  <div class="fullscreen-bg">
  <div class="auth-container">
    <div class="card auth-card">
      <div class="card-body">
        <h2 class="text-center mb-4">Registrate</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label for="email" class="form-label">Correo Electrónico:</label>
            <input 
              v-model="email" 
              type="email" 
              class="form-control" 
              placeholder="tu@email.com"
              required
            >
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">Contraseña:</label>
            <input 
              v-model="password" 
              type="password" 
              class="form-control" 
              placeholder="Mínimo 6 caracteres"
              minlength="6"
              required
            >
          </div>
          <button class="btn btn-primary w-100 py-3 mb-2" 
          type="submit"
          :disable="isLoading">
            {{ isLoading ? 'Registrando' : 'Registrarse' }}
          </button>
        </form>
        <p v-if="showMessage" class="['message', isError ? 'error' : 'success']" style="color: red; text-align: center;">{{ messageText }}</p>
        <div class="mt-3 text-center">
          <router-link to="/login" class="btn btn-link">¿Ya tienes cuenta? Inicia sesión</router-link>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      showMessage: false,
      isError: false,
      messageText: ''
    };
  },
  methods: {
    async handleRegister() {
      this.showMessage = false;
      this.isLoading = true;
      try {
        const result = await authService.register(this.email, this.password);
        this.showFeedback(result.message || '¡Registro exitoso!', false);
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        this.showFeedback(error.message || 'Error en el registro', true);
       
      }finally{
        this.isLoading = false;
      }
      
    },
    showFeedback(message, isError) {
      this.messageText = message;
      this.isError = isError;
      this.showMessage = true;
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        this.showMessage = false;
      }, 5000);
    }
  }
};


</script>
  
  <style lang="scss" scoped>
@import '../assets/scss/mixins';

.fullscreen-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('/images/imagelogin.png') center/cover no-repeat;
  display: grid;
  place-items: center;
}


 

  .auth-container {
    @include flex-center;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%);
    
    .auth-card {
      width: 100%;
      max-width: 400px;
      border: none;
      border-radius: $border-radius-lg;
      box-shadow: $box-shadow-lg;
      overflow: hidden;
      
      .card-body {
        padding: 2.5rem;
        background: white; /* Añadido para contraste */
        
        h2 {
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .form-control {
          border-radius: $border-radius;
          padding: 0.75rem 1rem;
          border-color: var(--gray-300);
          margin-bottom: 1rem;
          
          &:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 0.25rem rgba(var(--primary-rgb), 0.25);
          }
        }

        .btn-primary {
          width: 100%;
          padding: 0.5rem;
          margin-top: 1rem;
        }

        .btn-link {
          display: block;
          text-align: center;
          margin-top: 1rem;
          color: var(--primary);
        }
      }
    }
  }

</style>
  