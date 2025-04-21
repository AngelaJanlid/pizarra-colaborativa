<template>
  <nav class="topbar">
    <div class="user-info-container">
      <img
        src="../assets/images/imagelogin.png"
        alt="Usuario"
        class="user-avatar"
      />
      <div class="user-details">
        <div class="user-email">{{ userEmail }}</div>
        <small class="user-role">{{ userRole }}</small>
      </div>
    </div>

    <button @click="handleLogout" class="logout-btn">
      Cerrar sesión
    </button>
  </nav>
</template>

<script>
export default {
  name: 'Topbar',
  props: {
    userEmail: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      required: true
    }
  },
  methods: {
    handleLogout() {
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 250px; /* Igual al ancho del sidebar */
  right: 0;
  height: 60px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.user-info-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.user-details {
  line-height: 1.2;
}

.user-email {
  font-weight: bold;
  color: #212529;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.75rem;
  color: #6c757d;
  display: block;
}

.logout-btn {
  background: transparent;
  border: 3px solid #2D336B;
  color: #2D336B;
  padding: 6px 15px;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #2D336B;
  color: white;
  transform: translateY(-1px);
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .topbar {
    left: 0;
  }
  
  .user-email {
    font-size: 0.85rem;
  }
  
  .logout-btn {
    padding: 5px 12px;
    font-size: 0.9rem;
  }
}
</style>

