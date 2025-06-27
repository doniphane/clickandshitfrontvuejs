<script setup lang="ts">
import { useCartStore } from './store/cart'
const cart = useCartStore()
</script>

<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow mt-12">
    <h2 class="text-2xl font-bold mb-6">Mon panier</h2>
    <div v-if="cart.items.length === 0" class="text-gray-500 text-center py-8">
      Votre panier est vide.
    </div>
    <div v-else>
      <ul>
        <li v-for="item in cart.items" :key="item.id" class="flex items-center gap-4 border-b py-4">
          <img :src="item.imageName" alt="" class="w-16 h-16 object-cover rounded" v-if="item.imageName" />
          <div class="flex-1">
            <div class="font-semibold">{{ item.name }}</div>
            <div class="text-gray-500 text-sm">{{ item.price }} € x {{ item.quantity }}</div>
          </div>
          <button @click="cart.removeFromCart(item.id)" class="text-red-500 hover:underline">Retirer</button>
        </li>
      </ul>
      <div class="flex justify-between items-center mt-6">
        <div class="font-bold text-lg">Total : {{ cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) }} €</div>
        <button @click="cart.clearCart()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Vider le panier</button>
      </div>
    </div>
  </div>
</template> 