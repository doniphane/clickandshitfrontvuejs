<script setup lang="ts">
interface Props {
  name: string
  price: number | string
  imageName: string
  stockQuantity: number | string
  category?: string
  description: string
  createdAt?: string
  updatedAt?: string
  id: number | string
}

const props = defineProps<Props>()

// Émettre les événements pour les actions d'administration
const emit = defineEmits<{
  edit: [product: any]
  delete: [productId: number | string]
}>()

function handleEdit(event: Event): void {
  event.stopPropagation()
  event.preventDefault()
  emit('edit', {
    id: props.id,
    name: props.name,
    price: props.price,
    imageName: props.imageName,
    stockQuantity: props.stockQuantity,
    category: props.category,
    description: props.description,
    createdAt: props.createdAt,
    updatedAt: props.updatedAt
  })
}

function handleDelete(event: Event): void {
  event.stopPropagation()
  event.preventDefault()
  emit('delete', props.id)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full max-w-xs flex flex-col justify-between group">
    <div>
      <div class="relative">
        <img :src="imageName" :alt="name" class="w-full h-48 object-cover" v-if="imageName" />
        <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">Aucune image</div>
        
        <!-- Overlay avec boutons d'administration -->
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div class="flex gap-2">
            <!-- Bouton Modifier -->
            <button 
              @click="handleEdit($event)"
              class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
              title="Modifier le produit"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            
            <!-- Bouton Supprimer -->
            <button 
              @click="handleDelete($event)"
              class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
              title="Supprimer le produit"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Badge de stock -->
        <div class="absolute top-2 left-2">
          <span 
            :class="[
              'px-2 py-1 text-xs font-semibold rounded-full',
              Number(stockQuantity) > 10 ? 'bg-green-100 text-green-800' : 
              Number(stockQuantity) > 0 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            ]"
          >
            {{ Number(stockQuantity) > 0 ? `${stockQuantity} en stock` : 'Rupture' }}
          </span>
        </div>
      </div>
      
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-1 block text-lg">
          {{ name }}
        </h3>
        <p class="text-sm text-gray-500 mb-2" v-if="description">{{ description }}</p>
        <p class="text-sm text-gray-500 mb-2" v-if="category">{{ category }}</p>
        <p class="text-lg font-bold text-gray-800">
          {{ !isNaN(Number(price)) ? '$' + Number(price).toFixed(2) : 'Prix indisponible' }}
        </p>
        <p class="text-xs text-gray-400 mt-2" v-if="createdAt">Ajouté le : {{ new Date(createdAt).toLocaleDateString() }}</p>
      </div>
    </div>
    
    <div class="p-4 pt-0">
      <!-- Boutons d'action d'administration -->
      <div class="flex gap-3">
        <button 
          @click="handleEdit($event)"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>Modifier</span>
        </button>
        
        <button 
          @click="handleDelete($event)"
          class="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <span>Supprimer</span>
        </button>
      </div>
    </div>
  </div>
</template> 