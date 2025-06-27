import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../Layout.vue'
import Home from '../Home.vue'
import ProductDetail from '../components/ProductDetail.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'product/:id', component: ProductDetail, name: 'ProductDetail' }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 