<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../store/cart'

interface Product {
  id: number | string
  name: string
  price: number | string
  description: string
  imageName?: string
  imageUrl?: string
  category?: string
  stockQuantity: number
  createdAt?: string
  updatedAt?: string
}

const route = useRoute()
const cart = useCartStore()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref('')
const quantity = ref(1)

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:8000/api/products/${route.params.id}`)
    if (!res.ok) {
      throw new Error('Produit non trouvé')
    }
    product.value = await res.json()
    console.log(product.value)
  } catch (e) {
    error.value = 'Erreur lors du chargement du produit'
  } finally {
    loading.value = false
  }
})

function handleAddToCart(): void {
  if (!product.value) return
  
  cart.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    imageName: product.value.imageName || product.value.imageUrl || ''
  }, quantity.value)
  

  quantity.value = 1
}

function updateQuantity(newQuantity: number): void {
  if (product.value && newQuantity >= 1 && newQuantity <= product.value.stockQuantity) {
    quantity.value = newQuantity
  }
}

function formatPrice(price: number | string): string {
  return `$${Number(price).toFixed(2)}`
}
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
    <div class="text-lg text-gray-600">Chargement...</div>
  </div>
  
  <div v-else-if="error" class="text-red-500 text-center py-12">
    <div class="text-xl mb-4">{{ error }}</div>
    <a href="/" class="text-orange-500 hover:text-orange-600 font-medium">
      Retour à l'accueil
    </a>
  </div>
  
  <div v-else-if="product" class="flex flex-col md:flex-row gap-12 items-center justify-center py-12 px-4 rounded-lg max-w-5xl mx-auto mt-8">
    <!-- Image produit -->
    <div class="flex-shrink-0">
      <img
        v-if="product.imageName"
        :src="`http://localhost:8000/uploads/${product.imageName}`"
        :alt="product.name"
        class="rounded-xl w-[400px] h-[400px] object-cover shadow-lg"
      />
      <div v-else class="w-[400px] h-[400px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
        Aucune image
      </div>
    </div>
    
    <!-- Infos produit -->
    <div class="flex-1 w-full max-w-xl">
      <h1 class="text-3xl font-bold mb-2 text-gray-800">{{ product.name }}</h1>
      <div class="uppercase text-xs font-semibold text-gray-500 mb-4">
        {{ product.category || 'Catégorie' }}
      </div>
      
      <div class="mb-6">
        <span class="block text-gray-500 text-xs mb-1">Prix</span>
        <span class="inline-block bg-gray-100 px-6 py-3 rounded-lg text-2xl font-bold text-blue-400 mb-2">
          {{ formatPrice(product.price) }}
        </span>
      </div>
      
      <p class="mb-6 text-gray-700 leading-relaxed">{{ product.description }}</p>
      
      <!-- Sélecteur de quantité -->
      <div class="mb-6">
        <label class="block text-gray-700 font-medium mb-2">Quantité</label>
        <div class="flex items-center gap-4">
          <div class="flex items-center border rounded-lg">
            <button 
              @click="updateQuantity(quantity - 1)"
              :disabled="quantity <= 1"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <input 
              v-model.number="quantity"
              type="number"
              min="1"
              :max="product.stockQuantity"
              class="w-16 text-center border-none focus:outline-none font-medium"
              @input="(event) => {
                const target = event.target as HTMLInputElement
                if (target) {
                  updateQuantity(Number(target.value))
                }
              }"
            />
            <button 
              @click="updateQuantity(quantity + 1)"
              :disabled="quantity >= product.stockQuantity"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
          
          <button
            @click="handleAddToCart"
            :disabled="product.stockQuantity <= 0"
            class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
            </svg>
            Ajouter au panier
          </button>
        </div>
        
        <!-- Indicateur de stock -->
        <p class="text-sm text-gray-500 mt-2">
          Stock: {{ product.stockQuantity }} disponible{{ product.stockQuantity > 1 ? 's' : '' }}
        </p>
      </div>
      
      <!-- Informations supplémentaires -->
      <div class="text-xs text-gray-400 space-y-1">
        <div v-if="product.createdAt">
          Créé le : {{ new Date(product.createdAt).toLocaleDateString() }}
        </div>
        <div v-if="product.updatedAt">
          Mis à jour le : {{ new Date(product.updatedAt).toLocaleDateString() }}
        </div>
      </div>
    </div>
  </div>
</template> 