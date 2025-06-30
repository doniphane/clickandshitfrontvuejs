import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface CartItem {
  id: number | string
  name: string
  price: number
  imageName?: string
  quantity: number
}

export interface Product {
  id: number | string
  name: string
  price: number | string
  imageName?: string
  imageUrl?: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'))

  function addToCart(product: Product, quantity: number = 1): void {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageName: product.imageName || product.imageUrl || '',
        quantity: quantity
      })
    }
  }

  function updateQuantity(id: number | string, quantity: number): void {
    const item = items.value.find(item => item.id === id)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(id)
      } else {
        item.quantity = quantity
      }
    }
  }

  function removeFromCart(id: number | string): void {
    items.value = items.value.filter(item => item.id !== id)
  }

  function clearCart(): void {
    items.value = []
  }

  const totalCount = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  watch(items, (val) => {
    localStorage.setItem('cart', JSON.stringify(val))
  }, { deep: true })

  return { 
    items, 
    addToCart, 
    updateQuantity,
    removeFromCart, 
    clearCart, 
    totalCount,
    totalPrice,
    isEmpty
  }
}) 