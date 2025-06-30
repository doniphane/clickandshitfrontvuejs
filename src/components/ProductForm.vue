<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '../store/auth'

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
const auth = useAuthStore()

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

// Variables pour l'upload d'image
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const uploadError = ref<string>('')
const isUploading = ref(false)

// Types de fichiers autorisés
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024 // 5MB

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
    // Afficher l'aperçu de l'image existante
    if (newProduct.imageName) {
      // Construire l'URL complète de l'image
      if (newProduct.imageName.startsWith('http')) {
        imagePreview.value = newProduct.imageName
      } else {
        imagePreview.value = `http://localhost:8000/uploads/${newProduct.imageName}`
      }
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
    selectedFile.value = null
    imagePreview.value = null
  }
  errors.value = {}
  uploadError.value = ''
}, { immediate: true })

// Validation du fichier image
function validateImage(file: File): boolean {
  uploadError.value = ''
  
  // Vérifier le type de fichier
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Format non supporté. Utilisez JPEG, PNG ou WebP.'
    return false
  }
  
  // Vérifier la taille du fichier
  if (file.size > maxFileSize) {
    uploadError.value = 'Le fichier est trop volumineux. Taille maximum : 5MB.'
    return false
  }
  
  return true
}

// Gérer la sélection d'un fichier
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) {
    selectedFile.value = null
    imagePreview.value = null
    return
  }
  
  if (!validateImage(file)) {
    target.value = ''
    return
  }
  
  selectedFile.value = file
  
  // Créer l'aperçu de l'image
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// Supprimer l'image sélectionnée
function removeImage() {
  selectedFile.value = null
  imagePreview.value = null
  uploadError.value = ''
  const fileInput = document.getElementById('image-upload') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

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

async function handleSubmit() {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // Préparer les données du produit
    const productData: any = {
      name: formData.value.name.trim(),
      price: parseFloat(formData.value.price),
      description: formData.value.description.trim() || '',
      category: formData.value.category.trim() || '',
      stockQuantity: parseInt(formData.value.stockQuantity)
    }
    
    // Si une nouvelle image est sélectionnée, l'ajouter aux données
    if (selectedFile.value) {
      productData.image = selectedFile.value
    }
    
    emit('save', productData)
  } catch (error: any) {
    uploadError.value = error.message || 'Erreur lors de l\'upload de l\'image'
  } finally {
    isSubmitting.value = false
  }
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
            Image du produit
          </label>
          
          <!-- Zone d'upload -->
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
            <input 
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              @change="handleFileSelect"
              class="hidden"
            />
            
            <!-- Aperçu de l'image -->
            <div v-if="imagePreview" class="mb-4">
              <img 
                :src="imagePreview" 
                alt="Aperçu" 
                class="max-w-full h-32 object-cover rounded-lg mx-auto"
              />
              <button 
                type="button"
                @click="removeImage"
                class="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Supprimer l'image
              </button>
            </div>
            
            <!-- Zone de drop si pas d'image -->
            <div v-else>
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="mt-2 text-sm text-gray-600">
                <label for="image-upload" class="cursor-pointer text-orange-500 hover:text-orange-600 font-medium">
                  Cliquez pour sélectionner
                </label>
                ou glissez-déposez
              </p>
              <p class="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP jusqu'à 5MB
              </p>
            </div>
          </div>
          
          <!-- Message d'erreur upload -->
          <p v-if="uploadError" class="text-red-500 text-xs mt-1">{{ uploadError }}</p>
          
          <!-- Indicateur d'upload -->
          <div v-if="isUploading" class="mt-2 text-sm text-blue-600">
            Upload de l'image en cours...
          </div>
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