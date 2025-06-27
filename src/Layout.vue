<script setup lang="ts">
import { ShoppingCart } from 'lucide-vue-next'
import AppFooter from './components/AppFooter.vue'
import { useAuthStore } from './store/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50"> 
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 text-black shadow" style="background-color: #ea8c32;">
      <router-link to="/" class="font-bold text-xl hover:text-white transition-colors">Click and ship</router-link>
      
      <div class="flex gap-4 items-center">
        <router-link to="/" class="px-4 py-2 rounded hover:bg-white transition-colors">Accueil</router-link>

        <!-- Si connecté : avatar + lien profil -->
        <router-link
          v-if="auth.isAuthenticated"
          to="/profile"
          class="px-4 py-2 rounded hover:bg-white transition-colors flex items-center"
        >
          <img
            src="https://ui-avatars.com/api/?name=User"
            alt="Avatar"
            class="w-8 h-8 rounded-full mr-2"
          />
        </router-link>

        <!-- Si pas connecté  -->
        <router-link
          v-else
          to="/login"
          class="px-4 py-2 rounded hover:bg-white transition-colors"
        >
          Connexion
        </router-link>

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
