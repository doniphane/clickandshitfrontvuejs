<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../store/cart'

const cart = useCartStore()
const quantity = ref<number>(1)

interface Props {
  name: string
  price: number | string
  imageName: string
  stock: number | string
  category: string
  description: string
  createdAt?: string
  updatedAt?: string
  id: number | string
}

const props = defineProps<Props>()

function handleAddToCart(event: Event): void {
  event.stopPropagation()
  event.preventDefault()
  
  cart.addToCart({
    id: props.id,
    name: props.name,
    price: props.price,
    imageName: props.imageName
  }, quantity.value)
  
  // Reset quantity to 1 after adding
  quantity.value = 1
}

function updateQuantity(newQuantity: number): void {
  if (newQuantity >= 1 && newQuantity <= Number(props.stock)) {
    quantity.value = newQuantity
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full max-w-xs flex flex-col justify-between">
    <div>
      <div class="relative">
        <img :src="imageName" :alt="name" class="w-full h-48 object-cover" v-if="imageName" />
        <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">Aucune image</div>
      </div>
      <div class="p-4">
        <a
          :href="`/product/${props.id}`"
          target="_blank"
          rel="noopener"
          class="font-semibold text-gray-800 mb-1 block hover:text-orange-500 transition-colors text-lg"
        >
          {{ name }}
        </a>
        <p class="text-sm text-gray-500 mb-2" v-if="description">{{ description }}</p>
        <p class="text-sm text-gray-500 mb-2" v-if="category">{{ category }}</p>
        <p class="text-lg font-bold text-gray-800">
          {{ !isNaN(Number(price)) ? '$' + Number(price).toFixed(2) : 'Prix indisponible' }}
        </p>
        <p class="text-xs text-gray-400 mt-2" v-if="createdAt">Ajouté le : {{ new Date(createdAt).toLocaleDateString() }}</p>
      </div>
    </div>
    <div class="p-4 pt-0">
      <!-- Sélecteur de quantité -->
      <div class="flex items-center justify-between mb-3">
        <label class="text-sm font-medium text-gray-700">Quantité:</label>
        <div class="flex items-center border rounded-lg">
          <button 
            @click="updateQuantity(quantity - 1)"
            :disabled="quantity <= 1"
            class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <input 
            v-model.number="quantity"
            type="number"
            min="1"
            :max="Number(stock)"
            class="w-12 text-center border-none focus:outline-none"
            @input="(event) => {
              const target = event.target as HTMLInputElement
              if (target) {
                updateQuantity(Number(target.value))
              }
            }"
          />
          <button 
            @click="updateQuantity(quantity + 1)"
            :disabled="quantity >= Number(stock)"
            class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>
      
      <!-- Bouton d'ajout au panier -->
      <button 
        class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        @click="handleAddToCart($event)"
        :disabled="Number(stock) <= 0"
      >
        <span class="text-lg">+</span>
        <span>Ajouter au panier</span>
      </button>
      
      <!-- Indicateur de stock -->
      <p class="text-xs text-gray-500 mt-2 text-center">
        Stock: {{ stock }} disponible(s)
      </p>
    </div>
  </div>
</template>
