<script setup lang="ts">
import { useCartStore } from './store/cart'

const cart = useCartStore()

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}
</script>

<template>
  <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mt-12">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Mon panier</h2>
    
    <div v-if="cart.isEmpty" class="text-center py-12">
      <div class="text-gray-500 text-lg mb-4">Votre panier est vide.</div>
      <a href="/" class="text-orange-500 hover:text-orange-600 font-medium">
        Continuer vos achats →
      </a>
    </div>
    
    <div v-else>
      <!-- Liste des articles -->
      <div class="space-y-4 mb-8">
        <div 
          v-for="item in cart.items" 
          :key="item.id" 
          class="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <!-- Image du produit -->
          <div class="w-20 h-20 flex-shrink-0">
            <img 
              :src="item.imageName" 
              :alt="item.name" 
              class="w-full h-full object-cover rounded-lg"
              v-if="item.imageName"
            />
            <div v-else class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              Aucune image
            </div>
          </div>
          
          <!-- Informations du produit -->
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-800 truncate">{{ item.name }}</h3>
            <p class="text-gray-600 text-sm">Prix unitaire: {{ formatPrice(item.price) }}</p>
          </div>
          
          <!-- Contrôles de quantité -->
          <div class="flex items-center gap-2">
            <button 
              @click="cart.updateQuantity(item.id, item.quantity - 1)"
              class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors"
              :disabled="item.quantity <= 1"
            >
              -
            </button>
            <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
            <button 
              @click="cart.updateQuantity(item.id, item.quantity + 1)"
              class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors"
            >
              +
            </button>
          </div>
          
          <!-- Prix total de l'article -->
          <div class="text-right min-w-0">
            <p class="font-semibold text-gray-800">{{ formatPrice(item.price * item.quantity) }}</p>
          </div>
          
          <!-- Bouton supprimer -->
          <button 
            @click="cart.removeFromCart(item.id)"
            class="text-red-500 hover:text-red-700 p-2 transition-colors"
            title="Retirer du panier"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Résumé et actions -->
      <div class="border-t pt-6">
        <div class="flex justify-between items-center mb-6">
          <div class="text-lg">
            <span class="text-gray-600">Total ({{ cart.totalCount }} article{{ cart.totalCount > 1 ? 's' : '' }}):</span>
            <span class="font-bold text-2xl text-gray-800 ml-2">{{ formatPrice(cart.totalPrice) }}</span>
          </div>
          <div class="flex gap-3">
            <br>
            <button 
              @click="cart.clearCart()" 
              class="px-4 py-2 text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-lg transition-colors"
            >
              Vider le panier
            </button>
            <button 
              class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Passer la commande
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 