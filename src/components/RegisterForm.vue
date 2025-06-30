<template>
  <form @submit="handleSubmit" class="max-w-sm mx-auto bg-white p-8 rounded-lg shadow space-y-6">
    <h2 class="text-2xl font-bold text-center mb-4">Inscription</h2>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div>
      <label class="block mb-1 font-medium">Email</label>
      <input type="email" v-model="email" required class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
    </div>
    <div>
      <label class="block mb-1 font-medium">Mot de passe</label>
      <input type="password" v-model="password" required class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
    </div>
    <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition">S'inscrire</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()
const router = useRouter()

async function handleSubmit(e: Event) {
  e.preventDefault()
  error.value = ''
  try {
    await auth.register(email.value, password.value)
    // Redirection automatique vers la page d'accueil après inscription réussie
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Erreur d\'inscription'
  }
}
</script> 