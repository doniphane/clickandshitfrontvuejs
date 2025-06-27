import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  // Ajoute ici d'autres infos utilisateur si besoin

  function login() {
    isAuthenticated.value = true
  }
  function logout() {
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
}) 