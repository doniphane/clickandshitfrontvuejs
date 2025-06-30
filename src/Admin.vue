<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'
import ProductForm from './components/ProductForm.vue'

const auth = useAuthStore()
const router = useRouter()

// État pour les produits
const products = ref<any[]>([])
const loading = ref(false)
const error = ref('')

// État pour le formulaire
const showForm = ref(false)
const editingProduct = ref<any>(null)

// Vérifier les permissions
onMounted(() => {
  if (!auth.canAccessAdmin()) {
    router.push('/')
  } else {
    fetchProducts()
  }
})

async function fetchProducts() {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('http://localhost:8000/api/products', {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits')
    }
    
    const data = await response.json()
    
    // Gérer les différents formats de réponse API Platform sinon marche pas
    if (Array.isArray(data['hydra:member'])) {
      products.value = data['hydra:member']
    } else if (Array.isArray(data.member)) {
      products.value = data.member
    } else if (Array.isArray(data)) {
      products.value = data
    } else {
      products.value = []
      console.error('La réponse de l\'API produits n\'est pas un tableau', data)
    }
  } catch (err: any) {
    error.value = err.message
    console.error('Erreur lors de la récupération des produits', err)
  } finally {
    loading.value = false
  }
}

function openAddForm() {
  editingProduct.value = null
  showForm.value = true
}

function openEditForm(product: any) {
  editingProduct.value = product
  showForm.value = true
}

async function saveProduct(productData: any) {
  try {
    const url = editingProduct.value 
      ? `http://localhost:8000/api/products/${editingProduct.value.id}`
      : 'http://localhost:8000/api/products'
    
    const method = editingProduct.value ? 'PUT' : 'POST'
    
    // Nettoyer les données avant envoi - format JSON-LD requis par l'API
    const cleanData: any = {
      name: productData.name,
      price: parseFloat(productData.price),
      stockQuantity: parseInt(productData.stockQuantity)
    }
    
    // Ajouter les champs optionnels seulement s'ils ont une valeur
    if (productData.description && productData.description.trim()) {
      cleanData.description = productData.description.trim()
    }
    
    if (productData.category && productData.category.trim()) {
      cleanData.category = productData.category.trim()
    }
    
    if (productData.imageName && productData.imageName.trim()) {
      cleanData.imageName = productData.imageName.trim()
    }
    
  
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
      },
      body: JSON.stringify(cleanData)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = 'Erreur lors de la sauvegarde du produit'
      
      try {
        const errorData = JSON.parse(errorText)
        // Gestion des différents formats d'erreur API Platform
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData['hydra:description']) {
          errorMessage = errorData['hydra:description']
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.title) {
          errorMessage = errorData.title
        }
      } catch (e) {
        console.error('Erreur parsing JSON:', errorText)
        errorMessage = `Erreur serveur: ${response.status} ${response.statusText}`
      }
      
      throw new Error(errorMessage)
    }
    
    const result = await response.json()
 
    
    showForm.value = false
    await fetchProducts()
  } catch (err: any) {
    error.value = err.message
    console.error('Erreur saveProduct:', err)
  }
}

async function deleteProduct(productId: number) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    return
  }
  
  try {
    const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du produit')
    }
    
    await fetchProducts()
  } catch (err: any) {
    error.value = err.message
  }
}

function closeForm() {
  showForm.value = false
  editingProduct.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Administration des Produits</h1>
        <p class="mt-2 text-gray-600">Gérez vos produits en tant que vendeur</p>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Bouton d'ajout -->
      <div class="mb-6">
        <button 
          @click="openAddForm"
          class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          + Ajouter un produit
        </button>
      </div>

      <!-- Formulaire modal -->
      <ProductForm
        :product="editingProduct"
        :is-open="showForm"
        @close="closeForm"
        @save="saveProduct"
      />

      <!-- Liste des produits -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">Chargement...</div>
      </div>
      
      <div v-else-if="products.length === 0" class="text-center py-8">
        <div class="text-gray-500">Aucun produit trouvé</div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div class="relative">
            <img 
              :src="product.imageName || '/src/assets/baguette.jpg'" 
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-2 right-2 flex gap-2">
              <button 
                @click="openEditForm(product)"
                class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                title="Modifier"
              >
                ✏️
              </button>
              <button 
                @click="deleteProduct(product.id)"
                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm mb-2" v-if="product.description">{{ product.description }}</p>
            <p class="text-gray-500 text-sm mb-2" v-if="product.category">{{ product.category }}</p>
            <p class="text-lg font-bold text-gray-800 mb-2">${{ product.price }}</p>
            <p class="text-sm text-gray-500">Stock: {{ product.stockQuantity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 