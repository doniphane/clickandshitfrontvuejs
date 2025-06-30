<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'
import ProductForm from './components/ProductForm.vue'
import AdminProductCard from './components/AdminProductCard.vue'
import baguetteImage from './assets/baguette.jpg'

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
    console.log(' Début de fetchProducts - Récupération des produits...')
    
    const response = await fetch('http://localhost:8000/api/products', {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log(' Réponse API reçue:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits')
    }
    
    const data = await response.json()
    console.log(' Données brutes reçues de l\'API:', data)
    
    let productsArray: any[] = []
    
    // Gérer les différents formats de réponse API Platform sinon marche pas
    if (Array.isArray(data['hydra:member'])) {
      productsArray = data['hydra:member']
      console.log(' Format hydra:member détecté, produits trouvés:', productsArray.length)
    } else if (Array.isArray(data.member)) {
      productsArray = data.member
      console.log(' Format member détecté, produits trouvés:', productsArray.length)
    } else if (Array.isArray(data)) {
      productsArray = data
      console.log(' Format tableau direct détecté, produits trouvés:', productsArray.length)
    } else {
      productsArray = []
      console.error(' La réponse de l\'API produits n\'est pas un tableau', data)
    }
    
    // Log détaillé de chaque produit pour déboguer les images
    console.log(' Détail de chaque produit:')
    productsArray.forEach((product, index) => {
      console.log(`Produit ${index + 1}:`, {
        id: product.id,
        name: product.name,
        imageName: product.imageName,
        imageUrl: product.imageUrl,
        image: product.image,
        // Log de tous les champs pour voir la structure complète
        allFields: product
      })
    })
    
    products.value = productsArray
    console.log(' Produits assignés au state:', products.value.length)
    
  } catch (err: any) {
    error.value = err.message
    console.error(' Erreur lors de la récupération des produits', err)
  } finally {
    loading.value = false
    console.log(' fetchProducts terminé')
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
    
    const result = await response.json();
    // Met à jour la liste localement pour un affichage réactif
    if (editingProduct.value) {
      const idx = products.value.findIndex(p => p.id === result.id);
      if (idx !== -1) products.value[idx] = result;
    } else {
      products.value.push(result);
    }
    showForm.value = false;
    await fetchProducts(); 
  } catch (err: any) {
    error.value = err.message
    console.error('Erreur saveProduct:', err)
  }
}

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
    
    await fetchProducts()
  } catch (err: any) {
    error.value = err.message
  }
}

function closeForm() {
  showForm.value = false
  editingProduct.value = null
}

function getImageUrl(imageName: string | null): string {
  console.log('getImageUrl appelé avec:', imageName)
  
  if (!imageName) {
    console.log(' Aucune image, utilisation de l\'image par défaut')
    return baguetteImage;
  }
  
  // Si c'est déjà une URL complète
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    console.log(' URL complète détectée:', imageName)
    return imageName;
  }
  
  // Si c'est un chemin relatif avec uploads/
  if (imageName.startsWith('uploads/')) {
    const fullUrl = `http://localhost:8000/${imageName}`
    console.log(' Chemin uploads/ détecté, URL complète:', fullUrl)
    return fullUrl
  }
  
  // Sinon, on suppose que c'est un fichier uploadé par l'API
  const fullUrl = `http://localhost:8000/uploads/${imageName}`;
  console.log(' Nom de fichier simple, URL construite:', fullUrl)
  return fullUrl;
}

// Fonction pour déterminer quel champ d'image utiliser
function getProductImage(product: any): string {
  console.log(' Recherche de l\'image pour le produit:', product.name)
  
  // Essayer différents champs possibles dans l'ordre de priorité
  const imageFields = ['imageUrl', 'image', 'imageName', 'imagePath']
  
  for (const field of imageFields) {
    if (product[field]) {
      console.log(` Image trouvée dans le champ '${field}':`, product[field])
      return getImageUrl(product[field])
    }
  }
  
  console.log(' Aucune image trouvée, utilisation de l\'image par défaut')
  return baguetteImage
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  console.log(' Erreur de chargement d\'image:', {
    originalSrc: target.src,
    alt: target.alt
  })
  
  if (target) {
    console.log(' Remplacement par l\'image par défaut')
    target.src = baguetteImage
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Administration des Produits</h1>
            <p class="mt-2 text-gray-600">Gérez vos produits en tant que vendeur</p>
          </div>
          
          <!-- Statistiques -->
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

      <!-- Message d'erreur -->
      <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ error }}
      </div>

      <!-- Bouton d'ajout -->
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