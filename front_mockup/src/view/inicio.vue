<template>
  <div class="welcome-template">
    <!-- Banner superior con gradiente 
    <div class="welcome-banner">
      <div class="banner-content">
        <h1>Bienvenido a tu Editor</h1>
        <p>Crea diseños increíbles con nuestra herramienta</p>
      </div>
    </div>-->

    <!-- Contenido principal - AHORA SIN FONDO BLANCO -->
    <div class="template-content">
      <div class="content-section">
        <h1>Bienvenido</h1>
        <h2>Comienza tu diseño</h2>
        <router-link 
          to="/dashboard/editor" 
          class="btn btn-primary fw-bold hover-scale"
          style="padding: 10px 20px;"
        >
          Pizarra
        </router-link>
      </div>
    </div>
  </div>
</template>


<style>
.welcome-template {
  font-family: 'Arial', sans-serif;
  height: 100vh;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background-image: url('../assets/images/159Z_2107.w026.n002.628B.p1.628.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

/* Capa oscura semitransparente para mejor contraste */
.welcome-template::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 0;
}

.welcome-banner {
  background: linear-gradient(135deg, #2D336B 0%, #1a1f4b 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.template-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.content-section {
  background: rgba(255, 255, 255, 0.85); /* Fondo semitransparente */
  border-radius: 10px;
  padding: 2.5rem;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  backdrop-filter: blur(5px); /* Efecto vidrio */
  border: 1px solid rgba(255,255,255,0.3);
}

.content-section h2 {
  color: #2D336B;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.btn-primary {
  background-color: #2D336B;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #1a1f4b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Efecto de onda decorativo mejorado */
.welcome-banner::after {
  content: '';
  display: block;
  width: 100%;
  height: 30px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23ffffff'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E");
  background-size: cover;
  margin-top: -1px;
}
</style>
  
  