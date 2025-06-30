import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../Layout.vue'
import Home from '../Home.vue'
import ProductDetail from '../components/ProductDetail.vue'
import Login from '../Login.vue'
import Register from '../Register.vue'
import Profile from '../Profile.vue'
import Cart from '../Cart.vue'
import { useAuthStore } from '../store/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'product/:id', component: ProductDetail, name: 'ProductDetail' },
      { 
        path: 'login', 
        component: Login, 
        name: 'Login',
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
          const authStore = useAuthStore()
          if (authStore.isAuthenticated) {
            next('/')
          } else {
            next()
          }
        }
      },
      { 
        path: 'register', 
        component: Register, 
        name: 'Register',
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
          const authStore = useAuthStore()
          if (authStore.isAuthenticated) {
            next('/')
          } else {
            next()
          }
        }
      },
      { path: 'profile', component: Profile, name: 'Profile' },
      { path: 'cart', component: Cart, name: 'Cart' }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 