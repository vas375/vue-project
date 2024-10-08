import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth';
import Home from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(),//import.meta.env.VITE_BASE_API
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
      meta:{ requiresAuth:true ,redirect:'login'}
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    if(to.meta.redirect){
      next({ name:'login' });
    }else{
      next({ name:'root' });
    }
  } else {
    next();
  }
});

export default router
