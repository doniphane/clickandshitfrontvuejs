import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

export interface User {
  name?: string
  email?: string
  roles?: string[]
}

export const useAuthStore = defineStore('auth', () => {
  // Lire le token depuis le cookie au démarrage
  const token = ref<string | null>(Cookies.get('token') || null)
  const isAuthenticated = ref(!!token.value)
  const user = ref<User | null>(null)

  async function fetchProfile() {
    if (!token.value) return
    try {
      const res = await fetch('http://localhost:8000/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error('Impossible de récupérer le profil utilisateur')
      user.value = await res.json()
    } catch (e) {
      user.value = null
      isAuthenticated.value = false
      token.value = null
      Cookies.remove('token')
    }
  }

  // Appel automatique au démarrage si token
  if (token.value) {
    fetchProfile()
  }

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
      // data.token : valeur du token JWT reçu du backend
      //  sameSite: 'strict' le cookie n'est envoyé que pour le même site (protection CSRF) 
      Cookies.set('token', data.token, { secure: false, sameSite: 'strict' })
      await fetchProfile()
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
      if (!res.ok) throw new Error("Erreur lors de l'inscription")
      const data = await res.json()
      token.value = data.token
      isAuthenticated.value = true
      Cookies.set('token', data.token, { secure: true, sameSite: 'strict' })
      await fetchProfile()
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

  // Fonction pour vérifier si l'utilisateur a le rôle SELLER
  function hasSellerRole(): boolean {
    return user.value?.roles?.includes('ROLE_SELLER') || false
  }

  // Fonction pour vérifier si l'utilisateur peut accéder à l'admin
  function canAccessAdmin(): boolean {
    return isAuthenticated.value && hasSellerRole()
  }

  return { 
    isAuthenticated, 
    token, 
    user, 
    login, 
    register, 
    logout, 
    fetchProfile,
    hasSellerRole,
    canAccessAdmin
  }
}) 