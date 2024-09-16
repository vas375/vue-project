import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth';
import Home from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue'),
      meta:{ requiresAuth:false }
    },
    {
      path: '/personal',
      name: 'personal',
      component: () => import('@/views/personal/index.vue'),
      meta:{ requiresAuth:true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'root' });
  } else {
    next();
  }
});

export default router
