<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ShoppingCart, User, Search } from 'lucide-vue-next'
import ProductCard from './components/ProductCard.vue'

const products = ref<any[]>([])
const searchQuery = ref('')
const activeFilter = ref('')

const setFilter = (filter: string) => {
  activeFilter.value = filter
}

const filteredProducts = computed(() => {
  let list = [...products.value]

  // Recherche
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  }

  // Filtres de tri
  switch (activeFilter.value) {
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      list.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'price-asc':
      list.sort((a, b) => Number(a.price) - Number(b.price))
      break
    case 'price-desc':
      list.sort((a, b) => Number(b.price) - Number(a.price))
      break
  }
  return list
})

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8000/api/products')
    const data = await res.json()
    products.value = data['hydra:member'] ?? data.member ?? data
  } catch (e) {
    console.error('Erreur lors de la récupération des produits', e)
  }
})
</script>

<template>
    <!-- Hero -->
    <section class="text-center py-16 px-4" style="background-color: #ea8c32;">
      <h1 class="text-5xl text-white font-light leading-tight">
        La Boulangerie<br>
        <span class="text-yellow-300 font-bold">Artisanale</span>
      </h1>
      <p class="mt-6 text-white text-base max-w-2xl mx-auto leading-relaxed">
        Découvrez nos pains frais, viennoiseries croustillantes et pâtisseries gourmandes,<br>
        préparés avec amour chaque matin par nos boulangers.
      </p>
      <div class="mt-8 flex justify-center gap-4 flex-wrap">
        <button
          class="border-2 border-white px-8 py-3 rounded-full text-white hover:bg-white hover:text-orange-500 transition-all duration-300 font-medium">
          Voir nos produit →
        </button>
        <button
          class="border-2 border-white px-8 py-3 rounded-full text-white hover:bg-white hover:text-orange-500 transition-all duration-300 font-medium">
          Rechercher
        </button>
      </div>
    </section>

    <br>
    <br>
    <br>
   
    
    

    <!-- Recherche & Filtres -->
    <section class="bg-white mx-6 -mt-12 relative z-10 rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Rechercher un produit</h3>
      <div class="relative mb-6">
        <input v-model="searchQuery" type="text" placeholder="Rechercher un pain, Viennoiserie etc ..."
          class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        <Search class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div class="flex gap-3 flex-wrap justify-start">
        <button @click="setFilter('name-asc')"
          :class="['border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors', activeFilter === 'name-asc' ? 'bg-orange-500 text-white border-orange-500' : '']">
          Nom A-Z
        </button>
        <button @click="setFilter('name-desc')"
          :class="['border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors', activeFilter === 'name-desc' ? 'bg-orange-500 text-white border-orange-500' : '']">
          Nom Z-A
        </button>
        <button @click="setFilter('price-desc')"
          :class="['border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors', activeFilter === 'price-desc' ? 'bg-orange-500 text-white border-orange-500' : '']">
          Prix décroissant
        </button>
        <button @click="setFilter('price-asc')"
          :class="['border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors', activeFilter === 'price-asc' ? 'bg-orange-500 text-white border-orange-500' : '']">
          Prix croissant
        </button>
      </div>
    </section>

    <!-- Produits -->
    <section class="flex-1 px-6 py-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold text-gray-800">Nos Incontournable</h2>
        <a href="#" class="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium">
          Voir tout →
        </a>
      </div>
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          <a
            v-for="product in filteredProducts"
            :key="product.id"
            :href="`/product/${product.id}`"
            target="_blank"
            rel="noopener"
            class="block w-full h-full"
            style="text-decoration: none; color: inherit;"
          >
            <ProductCard
              :name="product.name"
              :price="product.price"
              :imageName="product.imageUrl || product.imageName || ''"
              :stock="product.stockQuantity"
              :category="typeof product.category === 'object' ? product.category?.name : product.category"
              :description="product.description"
            />
          </a>
        </div>
      </div>
    </section>

</template> 