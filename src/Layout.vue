<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'
import AppFooter from './components/AppFooter.vue'
import { useAuthStore } from './store/auth'

const auth = useAuthStore()
const showMenu = ref(false)

function handleLogout() {
  auth.logout()
  showMenu.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50"> 
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 text-black shadow" style="background-color: #ea8c32;">
      <router-link to="/" class="font-bold text-xl hover:text-white transition-colors">Click and ship</router-link>
      
      <div class="flex gap-4 items-center">
        <router-link to="/" class="px-4 py-2 rounded hover:bg-white transition-colors">Accueil</router-link>

        <!-- Si pas connecté : bouton Connexion -->
        <router-link
          v-if="!auth.isAuthenticated"
          to="/login"
          class="px-4 py-2 rounded hover:bg-white transition-colors"
        >
          Connexion
        </router-link>

        <!-- Si connecté : avatar, nom, menu -->
        <div v-else class="relative">
          <button @click="showMenu = !showMenu" class="flex items-center px-4 py-2 rounded hover:bg-white transition-colors focus:outline-none">
            <img
              src="https://ui-avatars.com/api/?name={{ auth.user?.name || auth.user?.email || 'User' }}"
              alt="Avatar"
              class="w-8 h-8 rounded-full mr-2"
            />
            <span class="font-medium">{{ auth.user?.name || auth.user?.email }}</span>
          </button>
          <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
            <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-100">Mon profil</router-link>
            <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Déconnexion</button>
          </div>
        </div>

        <!-- Panier -->
        <router-link to="/cart" class="flex items-center px-4 py-2 rounded hover:bg-white transition-colors">
          <ShoppingCart class="w-6 h-6" />
        </router-link>
      </div>
    </nav>

    <router-view />

    <AppFooter />
  </div>
</template>
