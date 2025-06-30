<script setup lang="ts">
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'

const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.replace('/login')
  }
})

watch(() => auth.isAuthenticated, (val) => {
  if (!val) {
    router.replace('/login')
  }
})
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
        <img :src="`https://ui-avatars.com/api/?name=${auth.user?.name || auth.user?.email || 'U'}`" class="w-16 h-16 rounded-full" alt="Avatar" />
        <div>
          <div v-if="auth.user?.name" class="font-semibold text-lg">{{ auth.user.name }}</div>
          <div v-if="auth.user?.email" class="text-gray-500">{{ auth.user.email }}</div>
          <div v-else class="text-gray-400 italic">Email non renseigné</div>
        </div>
      </div>
      <p class="text-gray-700">Bienvenue sur votre espace personnel.</p>
    </template>
  </div>
</template> 