<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-dark-100">Services</h1>
      <button class="btn-primary text-sm" @click="openAddModal"><Plus :size="16" /> Add Service</button>
    </div>

    <!-- Category Tabs -->
    <div class="flex gap-2 overflow-x-auto pb-3 mb-4">
      <button
        v-for="cat in categories"
        :key="cat"
        class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
        :class="activeCategory === cat ? 'gradient-gold text-dark-900' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Services List -->
    <div class="space-y-2">
      <div v-for="svc in filtered" :key="svc.id" class="card p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-medium text-dark-100">{{ svc.name }}</h3>
              <span class="badge badge-gold text-[10px]">{{ svc.category }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-dark-400">
              <span class="flex items-center gap-1"><Clock :size="14" /> {{ svc.duration }} min</span>
              <span class="font-semibold text-gold-400">{{ formatPrice(svc.price) }}</span>
            </div>
          </div>
          <div class="flex gap-1">
            <button class="p-2 rounded-lg hover:bg-dark-700 text-dark-400" @click="openEditModal(svc)"><Pencil :size="16" /></button>
            <button class="p-2 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400" @click="deleteService(svc.id)"><Trash2 :size="16" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <teleport to="body">
      <div v-if="showModal" class="overlay-backdrop" @click="showModal = false"></div>
      <div v-if="showModal" class="modal-content p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-dark-100 text-lg">{{ editingId ? 'Edit' : 'Add' }} Service</h3>
          <button @click="showModal = false" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400"><X :size="18" /></button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Name *</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="Service name" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">Duration (min)</label>
              <input v-model.number="form.duration" type="number" class="input-field" min="5" step="5" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">Price (₱)</label>
              <input v-model.number="form.price" type="number" class="input-field" min="0" step="50" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Category</label>
            <select v-model="form.category" class="input-field">
              <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>
        <button class="btn-primary w-full mt-5" @click="saveService">{{ editingId ? 'Update' : 'Add' }} Service</button>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { store, formatPrice, getServiceCategories } from '../../store'
import { Plus, Clock, Pencil, Trash2, X } from 'lucide-vue-next'

const activeCategory = ref('All')
const showModal = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', duration: 30, price: 0, category: 'Haircut' })
const allCategories = ['Haircut', 'Grooming', 'Color', 'Treatment', 'Styling']

const categories = computed(() => ['All', ...getServiceCategories(store.locationServices)])

const filtered = computed(() => {
  const svcList = store.locationServices
  if (activeCategory.value === 'All') return svcList
  return svcList.filter(s => s.category === activeCategory.value)
})

function openAddModal () {
  editingId.value = null
  Object.assign(form, { name: '', duration: 30, price: 0, category: 'Haircut' })
  showModal.value = true
}

function openEditModal (svc) {
  editingId.value = svc.id
  Object.assign(form, { name: svc.name, duration: svc.duration, price: svc.price, category: svc.category })
  showModal.value = true
}

function saveService () {
  if (editingId.value) {
    store.updateService(editingId.value, { ...form })
    store.showToast('Service updated', 'success')
  } else {
    store.addService({ ...form, locationIds: [store.currentLocationId] })
    store.showToast('Service added', 'success')
  }
  showModal.value = false
}

function deleteService (id) {
  if (confirm('Delete this service?')) {
    store.deleteService(id)
    store.showToast('Service deleted', 'success')
  }
}
</script>
