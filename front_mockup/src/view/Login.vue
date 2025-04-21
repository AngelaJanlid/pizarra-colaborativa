<template>
  <div class="fullscreen-bg">  
        <div class="auth-container">
            <div class="card auth-card">
              <div class="card-body">
                <div class="logo">
                  <img
                    src="../assets/images/marca2.png"
                    alt="Marca"
                    class="rounded-circle m-2"
                    width="150"
                    height="150"
                  />

                </div>
              <h2>Iniciar Sesión</h2>
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label>Email</label>
                  <input  v-model="email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label>Contraseña</label>
                  <input v-model="password" type="password" class="form-control" required />
                </div>
                <button class="btn btn-primary w-100 py-3 mb-2" 
                  type="submit"
                  :disable="isLoading">
                    {{ isLoading ? 'Iniciando Sesión' : 'Inicia Sesión' }}
                  </button>
                <p v-if="showMessage" class="['message', isError ? 'error' : 'success']" style="color: red; text-align: center;">{{ messageText }}</p>
                <router-link to="/register" class="btn btn-link">¿No tienes cuenta? Regístrate</router-link>
              </form>
              
            </div>
            </div>
          </div>
          </div>
        
  </template>
  
  <script>
import authService from "../services/authService";

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
      showMessage: false,
      isError: false,
      isLoading: false,
      messageText: ''
    };
  },
  methods: {
    async handleLogin() {
      this.showMessage = false;
      this.isLoading = true;

      try {
      
        const result = await authService.login(this.email, this.password);


        const userData = JSON.parse(localStorage.getItem('user'));
        const welcomeMessage = userData?.role === 'admin' 
          ? '¡Bienvenido Administrador!' 
          : '¡Bienvenido Usuario!';
        
        this.showFeedback(result.message || welcomeMessage, false);
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 2000);

      } catch (error) {
        this.showFeedback(error.message || 'Error en el inicio de sesión', true);
      } finally {
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
 .logo{
  text-align: center
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
  