import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
//import ProductView from '../views/Produit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/ProductsView.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainView.vue')
    }
  ]
})

export default router
