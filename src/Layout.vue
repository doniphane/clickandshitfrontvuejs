<script setup lang="ts">
import { ref } from 'vue'

import { ShoppingCart } from 'lucide-vue-next' 


// À remplacer par ta vraie logique d'authentification plus tard quand authentification sera en place 
const isAuthenticated = ref(false) 
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 text-black shadow" style="background-color: #ea8c32;">
      <router-link to="/" class="font-bold text-xl hover:text-white transition-colors">Click and ship</router-link>
      <div class="flex gap-4 items-center">
        <router-link to="/" class="px-4 py-2 rounded hover:bg-orange-400 transition-colors">Accueil</router-link>
        <router-link
          v-if="isAuthenticated"
          to="/profile"
          class="px-4 py-2 rounded hover:bg-orange-400 transition-colors flex items-center"
        >
          <img
            src="https://ui-avatars.com/api/?name=User"
            alt="Avatar"
            class="w-8 h-8 rounded-full mr-2"
          />
          Profil
        </router-link>
        <router-link to="/login" class="px-4 py-2 rounded hover:bg-orange-400 transition-colors">Connexion</router-link>
        <router-link to="/cart" class="flex items-center px-4 py-2 rounded hover:bg-orange-400 transition-colors">
  <ShoppingCart class="w-6 h-6" />
</router-link>

      </div>
    </nav>

    <router-view />

    <!-- Footer -->
    <footer class="bg-orange-500 text-center py-6 text-white font-medium mt-8">
      Tout droit réservé
    </footer>
  </div>
</template> 