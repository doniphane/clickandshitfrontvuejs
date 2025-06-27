<script setup>
import { useCartStore } from '../store/cart'
const cart = useCartStore()

const props = defineProps({
  name: String,             // Nom du produit
  price: [Number, String],  // Prix (
  imageName: String,        // URL de l'image
  stock: [Number, String],  // Quantité en stock
  category: String,      // category courte
  description: String,      // Description courte
  createdAt: String,        // Date de création
  updatedAt: String,
  id: [Number, String]
})

function handleAddToCart(event) {
  event.stopPropagation()
  event.preventDefault()
  cart.addToCart({
    id: props.id,
    name: props.name,
    price: props.price,
    imageName: props.imageName
  })
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
        <p class="text-sm text-gray-500 mb-2" v-if="category">{{ category}}</p>
        <p class="text-lg font-bold text-gray-800">
          {{ !isNaN(Number(price)) ? '$' + Number(price).toFixed(2) : 'Prix indisponible' }}
        </p>
        <p class="text-xs text-gray-400 mt-2" v-if="createdAt">Ajouté le : {{ new Date(createdAt).toLocaleDateString() }}</p>
      </div>
    </div>
    <div class="p-4 pt-0 flex justify-end">
      <button class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors" @click="handleAddToCart($event)">
        <span class="text-2xl font-bold">+</span>
      </button>
    </div>
  </div>
</template>
