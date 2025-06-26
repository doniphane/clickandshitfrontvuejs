<script setup>
defineProps({
  name: String,
  price: [Number, String],
  image: String,
  stock: [Number, String],
  description: String,
  createdAt: String,
  updatedAt: String
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full max-w-xs">
    <div class="relative">
      <img :src="image" :alt="name" class="w-full h-48 object-cover" v-if="image" />
      <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">Aucune image</div>
      
    </div>
    <div class="p-4 relative">
      <h3 class="font-semibold text-gray-800 mb-1">{{ name }}</h3>
      <button class="absolute top-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
        <span class="text-lg font-bold">+</span>
      </button>
      <p class="text-sm text-gray-500 mb-2" v-if="description">{{ description }}</p>
      <p class="text-sm text-gray-500 mb-1">Stock : {{ stock }}</p>
      <p class="text-lg font-bold text-gray-800">
        {{ !isNaN(Number(price)) ? '$' + Number(price).toFixed(2) : 'Prix indisponible' }}
      </p>
      <p class="text-xs text-gray-400 mt-2" v-if="createdAt">Ajouté le : {{ new Date(createdAt).toLocaleDateString() }}</p>
    </div>
  </div>
</template> 