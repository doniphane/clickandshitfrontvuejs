import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../Layout.vue'
import Home from '../Home.vue'
import ProductDetail from '../components/ProductDetail.vue'
import Login from '../Login.vue'
import Register from '../Register.vue'
import Profile from '../Profile.vue'
import Cart from '../Cart.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'product/:id', component: ProductDetail, name: 'ProductDetail' },
      { path: 'login', component: Login, name: 'Login' },
      { path: 'register', component: Register, name: 'Register' },
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