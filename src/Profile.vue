<script setup lang="ts">
import { useAuthStore } from './store/auth'
const auth = useAuthStore()
</script>

<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow mt-12">
    <template v-if="!auth.isAuthenticated">
      <h2 class="text-2xl font-bold mb-4 text-center">Connexion requise</h2>
      <LoginForm />
    </template>
    <template v-else>
      <h2 class="text-2xl font-bold mb-4">Mon profil</h2>
      <div class="flex items-center gap-4 mb-6">
        <img :src="`https://ui-avatars.com/api/?name=${auth.user?.name || auth.user?.email || 'User'}`" class="w-16 h-16 rounded-full" alt="Avatar" />
        <div>
          <div class="font-semibold text-lg">{{ auth.user?.name || 'Nom inconnu' }}</div>
          <div class="text-gray-500">{{ auth.user?.email }}</div>
        </div>
      </div>
      <p class="text-gray-700">Bienvenue sur votre espace personnel.</p>
    </template>
  </div>
</template> 