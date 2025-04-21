import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';
import Gusuarios from '../components/Gusuarios.vue';
import GrapesEditor from '../components/Grapes/GrapesEditor.vue';

const routes = [
  {
    path: '/login',
    name: 'login',  // Añade nombres a las rutas para mejor referencia
    component: () => import('../view/Login.vue'),  // Corregí 'view' por 'views'
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../view/Register.vue'),  
   
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../view/Dashboard.vue'),
    meta: { requiresAuth: true,},
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('../view/inicio.vue') // Crea este componente
      },



      {
        path: 'gusuarios', // 👈 NOTA: sin el primer slash
        name: 'GestionarUsuarios',
        component: () => import('../components/Gusuarios.vue'),
      },

      {
        path: 'gmuckops', // 👈 NOTA: sin el primer slash
        name: 'GestionarMockups',
        component: () => import('../components/Gmockups.vue'),
      },

      {
        path: 'editor',
        name: 'Editor',
        component: GrapesEditor,
        props: (route) => ({
          mockupId: route.params.id || null,
          editing: route.query.editing === 'true',
        }),
      },

     /* {
        path: 'editor/:id?', // El ? hace que el ID sea opcional
        name: 'Editor',
        props: true, // Pasa los params como props
        component: () => import('../view/EditorView.vue')
      },*/
      
     

      /*{
        path: 'editor',
        name: 'Editor',
        component: () => import('../view/EditorView.vue')
      }*/
    ]

    
  },


 
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});



router.beforeEach((to, from, next) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = !!user?.token
  // Permitir acceso a rutas públicas
  if (to.meta.isPublic) {
    return next();
  }

    // 3. Verificar autenticación para rutas protegidas
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        // Guardar la ruta original para redirección después del login
        return next({
          name: 'Login',
          query: { redirect: to.fullPath }
        })
      }

    // 4. Verificación adicional de roles si es necesario
    if (to.meta.requiresAdmin && user.role !== 'admin') {
      return next({ name: 'Forbidden' })
    }
  }

  return next();
});

export default router;