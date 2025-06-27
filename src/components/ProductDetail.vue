<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref<any>(null)
const loading = ref(true)
const error = ref('')
const quantity = ref(1)

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:8000/api/products/${route.params.id}`)
    product.value = await res.json()
    console.log(product.value)
  } catch (e) {
    error.value = 'Erreur lors du chargement du produit'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center min-h-[400px]">Chargement...</div>
  <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
  <div v-else class="flex flex-col md:flex-row gap-12 items-center justify-center py-12 px-4  rounded-lg  max-w-5xl mx-auto mt-8">
    <!-- Image produit -->
    <div class="flex-shrink-0">
      <img
        v-if="product.imageName"
        :src="`http://localhost:8000/uploads/${product.imageName}`"
        :alt="product.name"
        class="rounded-xl w-[400px] h-[400px] object-cover shadow"
      />
    </div>
    <!-- Infos produit -->
    <div class="flex-1 w-full max-w-xl">
      <h1 class="text-3xl font-bold mb-2">{{ product.name }}</h1>
      <div class="uppercase text-xs font-semibold text-gray-500 mb-4">{{ product.category || 'Catégorie' }}</div>
      <div class="mb-6">
        <span class="block text-gray-500 text-xs mb-1">Prix</span>
        <span class="inline-block bg-gray-100 px-6 py-3 rounded-lg text-2xl font-bold text-blue-600 mb-2">
          $ {{ product.price }} 
        </span>
      </div>
      <p class="mb-6 text-gray-700">{{ product.description }}</p>
      <div class="flex items-center gap-4 mb-6">
        <div class="border rounded ">
          <span class="block text-xs text-gray-500 mb-1 " >Qantité</span>
          <select v-model="quantity" class="px-3 py-2">
            <option v-for="n in Math.min(product.stockQuantity, 10)" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <button
          class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow"
        >
         Ajouter au panier
        </button>
      </div>
      <!--En option afficher le stock-->
      <!-- <div class="text-xs text-gray-400">
        Stock : {{ product.stockQuantity }}<br>
        Créé le : {{ product.createdAt }}<br>
        Mis à jour le : {{ product.updatedAt }}
      </div> -->
    </div>
  </div>
</template> 