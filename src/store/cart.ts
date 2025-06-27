import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface CartItem {
  id: number
  name: string
  price: number
  imageName?: string
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'))

  function addToCart(product: any) {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageName: product.imageName || product.imageUrl || '',
        quantity: 1
      })
    }
  }

  function removeFromCart(id: number) {
    items.value = items.value.filter(item => item.id !== id)
  }

  function clearCart() {
    items.value = []
  }

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))


  watch(items, (val) => {
    localStorage.setItem('cart', JSON.stringify(val))
  }, { deep: true })

  return { items, addToCart, removeFromCart, clearCart, totalCount }
}) 