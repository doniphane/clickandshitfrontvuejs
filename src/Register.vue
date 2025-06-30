<template>
  <div class="flex justify-center items-center min-h-[60vh]">
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './store/auth'
import RegisterForm from './components/RegisterForm.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script> 