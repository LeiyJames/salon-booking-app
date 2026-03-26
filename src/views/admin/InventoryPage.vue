<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-2xl font-bold text-dark-100">Inventory</h1>
        <p class="text-xs text-dark-400 mt-1">Manage salon products and stock levels.</p>
      </div>
      <button class="btn-primary text-sm" @click="openAddModal"><Plus :size="16" /> Add Product</button>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="card p-3">
        <p class="text-[10px] text-dark-400 uppercase tracking-wider mb-1">Total Items</p>
        <p class="text-xl font-bold text-dark-100">{{ store.inventory.length }}</p>
      </div>
      <div class="card p-3">
        <p class="text-[10px] text-dark-400 uppercase tracking-wider mb-1">Low Stock</p>
        <p class="text-xl font-bold text-amber-400">{{ store.inventory.filter(i => i.quantity <= i.minStock).length }}</p>
      </div>
      <div class="card p-3">
        <p class="text-[10px] text-dark-400 uppercase tracking-wider mb-1">Out of Stock</p>
        <p class="text-xl font-bold text-red-400">{{ store.inventory.filter(i => i.quantity === 0).length }}</p>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="flex flex-col md:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" :size="18" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search products..." 
          class="input-field pl-10 h-10"
        />
      </div>
      <div class="flex gap-2 overflow-x-auto">
        <button 
          v-for="cat in categories" 
          :key="cat" 
          @click="activeCategory = cat"
          class="px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap"
          :class="activeCategory === cat ? 'gradient-gold text-dark-900 shadow-lg shadow-gold-500/20' : 'bg-dark-800 text-dark-400 border border-white/5 hover:border-dark-600'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Inventory List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in filtered" :key="item.id" class="card p-4 group">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 rounded-2xl bg-dark-700 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
            <Package :size="24" />
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openEditModal(item)" class="p-2 rounded-lg hover:bg-dark-600 text-dark-300"><Pencil :size="16" /></button>
            <button @click="deleteItem(item.id)" class="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 :size="16" /></button>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-dark-100 group-hover:text-gold-400 transition-colors">{{ item.name }}</h3>
          <p class="text-xs text-dark-400 mb-3">{{ item.category }}</p>
          
          <div class="flex items-end justify-between">
            <div>
              <p class="text-[10px] text-dark-500 uppercase tracking-tighter">Stock Level</p>
              <div class="flex items-center gap-2">
                <p class="text-lg font-bold" :class="getStockClass(item)">{{ item.quantity }}</p>
                <span v-if="item.quantity <= item.minStock" class="p-1 px-1.5 rounded-md bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase">Low Stock</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-dark-500 uppercase tracking-tighter">Price</p>
              <p class="text-lg font-bold text-gold-400">{{ formatPrice(item.price) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="col-span-full py-12 text-center card bg-transparent border-dashed">
        <PackageSearch :size="48" class="text-dark-600 mx-auto mb-3" />
        <p class="text-dark-400">No products found matching your search.</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <teleport to="body">
      <div v-if="showModal" class="overlay-backdrop" @click="showModal = false"></div>
      <div v-if="showModal" class="modal-content p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-display font-semibold text-dark-100 text-lg">{{ editingId ? 'Edit' : 'Add' }} Product</h3>
          <button @click="showModal = false" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400 transition-colors"><X :size="20" /></button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Product Name *</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="e.g. Premium Hair Wax" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">Category</label>
              <select v-model="form.category" class="input-field">
                <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">Retail Price (₱)</label>
              <input v-model.number="form.price" type="number" class="input-field" placeholder="0" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">Quantity</label>
              <input v-model.number="form.quantity" type="number" class="input-field" placeholder="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">Min Stock Alert</label>
              <input v-model.number="form.minStock" type="number" class="input-field" placeholder="5" />
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button @click="showModal = false" class="flex-1 px-4 py-2.5 rounded-xl border border-dark-600 text-sm font-medium text-dark-300 hover:bg-dark-700 transition-colors">Cancel</button>
          <button @click="saveItem" class="flex-1 btn-primary text-sm">{{ editingId ? 'Update' : 'Add' }} Product</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { store, formatPrice } from '../../store'
import { Plus, Package, Pencil, Trash2, X, Search, PackageSearch } from 'lucide-vue-next'

const searchQuery = ref('')
const activeCategory = ref('All')
const showModal = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  category: 'Styling',
  quantity: 0,
  price: 0,
  minStock: 5
})

const allCategories = ['Styling', 'Hair Care', 'Treatment', 'Tools', 'Equipment', 'Other']
const categories = computed(() => ['All', ...allCategories])

const filtered = computed(() => {
  return store.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'All' || item.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

function getStockClass(item) {
  if (item.quantity === 0) return 'text-red-500'
  if (item.quantity <= item.minStock) return 'text-amber-500'
  return 'text-green-500'
}

function openAddModal() {
  editingId.value = null
  Object.assign(form, {
    name: '',
    category: 'Styling',
    quantity: 0,
    price: 0,
    minStock: 5
  })
  showModal.value = true
}

function openEditModal(item) {
  editingId.value = item.id
  Object.assign(form, {
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    price: item.price,
    minStock: item.minStock
  })
  showModal.value = true
}

function saveItem() {
  if (!form.name) return store.showToast('Product name is required', 'error')
  
  if (editingId.value) {
    store.updateInventoryItem(editingId.value, { ...form })
  } else {
    store.addInventoryItem({ ...form })
  }
  showModal.value = false
}

function deleteItem(id) {
  if (confirm('Are you sure you want to remove this product from inventory?')) {
    store.deleteInventoryItem(id)
  }
}
</script>
