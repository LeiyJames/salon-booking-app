<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-dark-100">Services</h1>
      <button class="btn-primary text-sm" @click="openAddModal"><Plus :size="16" /> Add Service</button>
    </div>
    <div class="flex gap-2 overflow-x-auto pb-3 mb-4">
      <button v-for="cat in categories" :key="cat" class="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
        :class="activeCategory === cat ? 'gradient-gold text-dark-900' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'" @click="activeCategory = cat">{{ cat }}</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="svc in filtered" :key="svc.id" class="card overflow-hidden flex flex-col group">
        <!-- Thumbnail -->
        <div class="h-32 bg-dark-700 relative overflow-hidden">
          <img v-if="svc.image" :src="svc.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div v-else class="w-full h-full flex items-center justify-center text-dark-500">
            <ImageIcon :size="32" />
          </div>
          <div class="absolute top-2 right-2 flex gap-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button class="w-8 h-8 rounded-full bg-white text-dark-900 flex items-center justify-center shadow-lg hover:bg-gold-500 transition-colors" @click="openEditModal(svc)"><Pencil :size="14" /></button>
            <button class="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors" @click="deleteService(svc.id)"><Trash2 :size="14" /></button>
          </div>
          <div class="absolute bottom-2 left-2">
            <span class="badge badge-gold text-[10px]">{{ svc.category }}</span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="font-bold text-dark-100 mb-2 truncate">{{ svc.name }}</h3>
          <div class="mt-auto flex items-center justify-between text-sm">
            <span class="flex items-center gap-1 text-dark-400"><Clock :size="14" /> {{ svc.duration }} min</span>
            <span class="font-bold text-gold-400">{{ formatPrice(svc.price) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div v-if="showModal" class="overlay-backdrop" @click="showModal = false"></div>
      <div v-if="showModal" class="modal-content p-6 scale-up max-w-md">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-display text-xl font-bold text-dark-100">{{ editingId ? 'Edit' : 'Add' }} Service</h3>
          <button @click="showModal = false" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400 transition-colors"><X :size="20" /></button>
        </div>

        <div class="space-y-5">
          <!-- Image Preview/Input -->
          <div>
            <label class="block text-sm font-semibold text-dark-300 mb-2">Service Image URL</label>
            <div class="flex gap-4">
              <div class="w-24 h-24 rounded-xl bg-dark-700 overflow-hidden shrink-0 border border-white/5">
                <img v-if="form.image" :src="form.image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-dark-500"><ImageIcon :size="24" /></div>
              </div>
              <div class="flex-1">
                <input v-model="form.image" type="text" class="input-field text-xs mb-2" placeholder="e.g. /services/classic_haircut.png" />
                <p class="text-[10px] text-dark-500">Provide a path (e.g. /services/your-image.png) or a web URL.</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-dark-300 mb-1.5">Service Name*</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="e.g. Royal Shave" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-dark-300 mb-1.5">Duration (min)</label>
              <div class="relative">
                <input v-model.number="form.duration" type="number" class="input-field pr-12" min="5" step="5" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dark-500">min</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-dark-300 mb-1.5">Price (₱)</label>
              <div class="relative">
                <input v-model.number="form.price" type="number" class="input-field pr-8" min="0" step="50" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dark-500">₱</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-dark-300 mb-1.5">Category</label>
            <select v-model="form.category" class="input-field appearance-none bg-dark-700">
              <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>

        <button class="btn-primary w-full mt-8 py-3.5 text-base font-bold" @click="saveService">
          {{ editingId ? 'Update' : 'Add' }} Service
        </button>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { store, formatPrice, getServiceCategories } from '../../store'
import { Plus, Clock, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-vue-next'

const activeCategory = ref('All')
const showModal = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', duration: 30, price: 0, category: 'Haircut', image: '' })
const allCategories = ['Haircut', 'Grooming', 'Color', 'Treatment', 'Styling']

const categories = computed(() => ['All', ...getServiceCategories(store.locationServices)])
const filtered = computed(() => { 
  const svcList = store.locationServices
  if (activeCategory.value === 'All') return svcList
  return svcList.filter(s => s.category === activeCategory.value) 
})

function openAddModal () { 
  editingId.value = null
  Object.assign(form, { name: '', duration: 30, price: 0, category: 'Haircut', image: '' })
  showModal.value = true 
}

function openEditModal (svc) { 
  editingId.value = svc.id
  Object.assign(form, { 
    name: svc.name, 
    duration: svc.duration, 
    price: svc.price, 
    category: svc.category,
    image: svc.image || ''
  })
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
