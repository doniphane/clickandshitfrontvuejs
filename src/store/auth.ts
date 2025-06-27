import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

export interface User {
  name?: string
  email?: string
}

export const useAuthStore = defineStore('auth', () => {
  // Lire le token depuis le cookie au démarrage
  const token = ref<string | null>(Cookies.get('token') || null)
  const isAuthenticated = ref(!!token.value)
  const user = ref<User | null>(null)
  // Ajoute ici d'autres infos utilisateur si besoin

  async function login(email: string, password: string) {
    try {
      const res = await fetch('http://localhost:8000/api/login_check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      })
      if (!res.ok) throw new Error('Identifiants invalides')
      const data = await res.json()
      token.value = data.token
      isAuthenticated.value = true
      // On suppose que le backend renvoie aussi les infos utilisateur dans data.user
      user.value = data.user || { email } // fallback : email utilisé comme identifiant
      Cookies.set('token', data.token, { secure: true, sameSite: 'strict' })
      return true
    } catch (e: any) {
      isAuthenticated.value = false
      token.value = null
      user.value = null
      Cookies.remove('token')
      throw e
    }
  }

  async function register(email: string, password: string) {
    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error('Erreur lors de l’inscription')
      const data = await res.json()
      token.value = data.token
      isAuthenticated.value = true
      user.value = data.user || { email }
      Cookies.set('token', data.token, { secure: true, sameSite: 'strict' })
      return true
    } catch (e: any) {
      isAuthenticated.value = false
      token.value = null
      user.value = null
      Cookies.remove('token')
      throw e
    }
  }

  function logout() {
    isAuthenticated.value = false
    token.value = null
    user.value = null
    Cookies.remove('token')
  }

  return { isAuthenticated, token, user, login, register, logout }
}) 