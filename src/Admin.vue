<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'
import ProductForm from './components/ProductForm.vue'
import AdminProductCard from './components/AdminProductCard.vue'


const auth = useAuthStore()
const router = useRouter()

// État réactif pour gérer les données
const products = ref<any[]>([]) // Liste des produits
const loading = ref(false)      
const error = ref('')         

// État pour le formulaire modal
const showForm = ref(false)          
const editingProduct = ref<any>(null) // Produit en cours d'édition

// Vérification des permissions à l'initialisation
onMounted(() => {
  if (!auth.canAccessAdmin()) {
    router.push('/') // Redirection si pas admin
  } else {
    fetchProducts() // Charger les produits si admin
  }
})

// Fonction pour récupérer tous les produits depuis l'API
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
    
    // Gestion des différents formats de réponse de l'API
    if (Array.isArray(data['hydra:member'])) {
      products.value = data['hydra:member']
    } else if (Array.isArray(data.member)) {
      products.value = data.member
    } else if (Array.isArray(data)) {
      products.value = data
    } else {
      products.value = []
    }
    
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Ouvrir le formulaire pour ajouter un nouveau produit
function openAddForm() {
  editingProduct.value = null
  showForm.value = true
}

// Ouvrir le formulaire pour modifier un produit existant
function openEditForm(product: any) {
  editingProduct.value = product
  showForm.value = true
}

// Sauvegarder un produit (création ou modification)
async function saveProduct(productData: any) {
  try {
    // Déterminer l'URL et la méthode selon si on crée ou modifie
    const url = editingProduct.value 
      ? `http://localhost:8000/api/products/${editingProduct.value.id}`
      : 'http://localhost:8000/api/products'
    
    const method = editingProduct.value ? 'PUT' : 'POST'
    
    // Préparer les données pour l'API
    const cleanData: any = {
      name: productData.name,
      price: parseFloat(productData.price),
      stockQuantity: parseInt(productData.stockQuantity)
    }
    
    // Ajouter les champs optionnels s'ils existent
    if (productData.description?.trim()) {
      cleanData.description = productData.description.trim()
    }
    
    if (productData.category?.trim()) {
      cleanData.category = productData.category.trim()
    }
    
    if (productData.imageName?.trim()) {
      cleanData.imageName = productData.imageName.trim()
    }
    
    // Envoyer la requête à l'API
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
      throw new Error('Erreur lors de la sauvegarde du produit')
    }
    
    showForm.value = false
    await fetchProducts()
    
  } catch (err: any) {
    error.value = err.message
  }
}

// Supprimer un produit
async function deleteProduct(productId: number | string) {
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
    
    await fetchProducts() // Recharger la liste après suppression
  } catch (err: any) {
    error.value = err.message
  }
}

// Fermer le formulaire modal
function closeForm() {
  showForm.value = false
  editingProduct.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête avec titre et statistiques -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Administration des Produits</h1>
            <p class="mt-2 text-gray-600">Gérez vos produits en tant que vendeur</p>
          </div>
          
          <!-- Statistiques des produits -->
          <div class="mt-4 md:mt-0 flex gap-4">
            <div class="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div class="text-sm text-gray-500">Total produits</div>
              <div class="text-2xl font-bold text-gray-900">{{ products.length }}</div>
            </div>
            <div class="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div class="text-sm text-gray-500">En stock</div>
              <div class="text-2xl font-bold text-green-600">
                {{ products.filter(p => p.stockQuantity > 0).length }}
              </div>
            </div>
            <div class="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div class="text-sm text-gray-500">Rupture</div>
              <div class="text-2xl font-bold text-red-600">
                {{ products.filter(p => p.stockQuantity <= 0).length }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Affichage des erreurs -->
      <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ error }}
      </div>

      <!-- Bouton pour ajouter un nouveau produit -->
      <div class="mb-6">
        <button 
          @click="openAddForm"
          class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Ajouter un produit
        </button>
      </div>

      <!-- Formulaire modal pour créer/modifier un produit -->
      <ProductForm
        :product="editingProduct"
        :is-open="showForm"
        @close="closeForm"
        @save="saveProduct"
      />

      <!-- Affichage de la liste des produits -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">Chargement...</div>
      </div>
      
      <div v-else-if="products.length === 0" class="text-center py-8">
        <div class="text-gray-500">Aucun produit trouvé</div>
      </div>
      
      <!-- Grille des produits avec le composant AdminProductCard -->
      <div v-else class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          <AdminProductCard
            v-for="product in products" 
            :key="product.id"
            :id="product.id"
            :name="product.name"
            :price="product.price"
            :imageName="product.imageUrl || product.imageName || ''"
            :stockQuantity="product.stockQuantity"
            :category="product.category || ''"
            :description="product.description"
            :createdAt="product.createdAt"
            :updatedAt="product.updatedAt"
            @edit="openEditForm"
            @delete="deleteProduct"
          />
        </div>
      </div>
    </div>
  </div>
</template> 