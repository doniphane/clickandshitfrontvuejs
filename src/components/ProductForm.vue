<script setup lang="ts">
import { ref, watch } from 'vue'

interface Product {
  id?: number
  name: string
  price: number
  description?: string
  category?: string
  stockQuantity: number
  imageName?: string
}

interface Props {
  product?: Product | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', product: Omit<Product, 'id'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref({
  name: '',
  price: '',
  description: '',
  category: '',
  stockQuantity: '',
  imageName: ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Réinitialiser le formulaire quand le produit change
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value = {
      name: newProduct.name || '',
      price: (newProduct.price?.toString()) || '',
      description: newProduct.description || '',
      category: newProduct.category || '',
      stockQuantity: (newProduct.stockQuantity?.toString()) || '',
      imageName: newProduct.imageName || ''
    }
  } else {
    formData.value = {
      name: '',
      price: '',
      description: '',
      category: '',
      stockQuantity: '',
      imageName: ''
    }
  }
  errors.value = {}
}, { immediate: true })

function validateForm(): boolean {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Le nom du produit est obligatoire'
  }
  
  if (!formData.value.price || isNaN(Number(formData.value.price))) {
    errors.value.price = 'Le prix doit être un nombre valide'
  } else if (Number(formData.value.price) <= 0) {
    errors.value.price = 'Le prix doit être positif'
  }
  
  if (!formData.value.stockQuantity || isNaN(Number(formData.value.stockQuantity))) {
    errors.value.stockQuantity = 'La quantité en stock doit être un nombre valide'
  } else if (Number(formData.value.stockQuantity) < 0) {
    errors.value.stockQuantity = 'La quantité en stock doit être positive ou nulle'
  }
  
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  const productData = {
    name: formData.value.name.trim(),
    price: parseFloat(formData.value.price),
    description: formData.value.description.trim() || undefined,
    category: formData.value.category.trim() || undefined,
    stockQuantity: parseInt(formData.value.stockQuantity),
    imageName: formData.value.imageName.trim() || undefined
  }
  
  // Nettoyer les données - enlever les propriétés undefined
  const cleanData: any = {}
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleanData[key] = value
    }
  })
  
  console.log('Données du formulaire:', cleanData)
  emit('save', cleanData)
  isSubmitting.value = false
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ product ? 'Modifier le produit' : 'Ajouter un produit' }}
        </h2>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nom du produit *
          </label>
          <input 
            v-model="formData.name"
            type="text"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500',
              errors.name ? 'border-red-500' : 'border-gray-300'
            ]"
            placeholder="Ex: Pain au chocolat"
          />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>
        
        <!-- Prix -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Prix *
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input 
              v-model="formData.price"
              type="number"
              step="0.01"
              min="0"
              :class="[
                'w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500',
                errors.price ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="0.00"
            />
          </div>
          <p v-if="errors.price" class="text-red-500 text-xs mt-1">{{ errors.price }}</p>
        </div>
        
        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea 
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Description du produit (optionnel)"
          ></textarea>
        </div>
        
        <!-- Catégorie -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <input 
            v-model="formData.category"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Ex: Viennoiseries (optionnel)"
          />
        </div>
        
        <!-- Stock -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Quantité en stock *
          </label>
          <input 
            v-model="formData.stockQuantity"
            type="number"
            min="0"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500',
              errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
            ]"
            placeholder="0"
          />
          <p v-if="errors.stockQuantity" class="text-red-500 text-xs mt-1">{{ errors.stockQuantity }}</p>
        </div>
        
        <!-- Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            URL de l'image
          </label>
          <input 
            v-model="formData.imageName"
            type="url"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="https://example.com/image.jpg (optionnel)"
          />
        </div>
        
        <!-- Boutons -->
        <div class="flex gap-3 pt-4">
          <button 
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <span v-if="isSubmitting">Enregistrement...</span>
            <span v-else>{{ product ? 'Modifier' : 'Ajouter' }}</span>
          </button>
          <button 
            type="button"
            @click="handleClose"
            :disabled="isSubmitting"
            class="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 