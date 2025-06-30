<template>
  <div class="flex justify-center items-center min-h-[60vh]">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './store/auth'
import LoginForm from './components/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script> 