<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-dark-100">Clients</h1>
      <button class="btn-primary text-sm" @click="showAddModal = true"><UserPlus :size="16" /> Add Client</button>
    </div>

    <!-- Search -->
    <div class="relative mb-5">
      <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
      <input v-model="search" type="text" class="input-field pl-10" placeholder="Search clients..." />
    </div>

    <!-- List -->
    <div class="space-y-2">
      <div v-for="client in filteredClients" :key="client.id" class="card p-4 cursor-pointer" @click="selectedClient = client">
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-full gradient-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {{ getInitials(client.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-dark-100">{{ client.name }}</h3>
            <div class="flex items-center gap-3 text-sm text-dark-400">
              <span v-if="client.phone" class="flex items-center gap-1"><Phone :size="12" /> {{ client.phone }}</span>
              <span v-if="client.email" class="flex items-center gap-1"><Mail :size="12" /> {{ client.email }}</span>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-xs text-dark-400">{{ clientAppointmentCount(client.id) }} visits</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Detail Modal -->
    <teleport to="body">
      <div v-if="selectedClient" class="overlay-backdrop" @click="selectedClient = null"></div>
      <div v-if="selectedClient" class="modal-content p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-dark-100 text-lg">{{ selectedClient.name }}</h3>
          <button @click="selectedClient = null" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400"><X :size="18" /></button>
        </div>
        <div class="space-y-3 text-sm">
          <div v-if="selectedClient.email" class="flex items-center gap-2 text-dark-300"><Mail :size="16" /> {{ selectedClient.email }}</div>
          <div v-if="selectedClient.phone" class="flex items-center gap-2 text-dark-300"><Phone :size="16" /> {{ selectedClient.phone }}</div>
          <div v-if="selectedClient.notes" class="text-dark-400 italic">{{ selectedClient.notes }}</div>
        </div>
        <h4 class="font-medium text-dark-200 mt-5 mb-3">Appointment History</h4>
        <div v-if="clientHistory.length" class="space-y-2 max-h-64 overflow-y-auto">
          <div v-for="apt in clientHistory" :key="apt.id" class="bg-dark-700 rounded-xl p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-dark-100 text-sm font-medium">{{ apt.services.map(s => s.name).join(', ') }}</p>
                <p class="text-dark-400 text-xs">{{ formatDate(apt.date) }} · {{ formatTime(apt.time) }}</p>
              </div>
              <span class="badge text-[10px]" :class="apt.status === 'cancelled' ? 'badge-danger' : 'badge-success'">{{ apt.status }}</span>
            </div>
          </div>
        </div>
        <p v-else class="text-dark-400 text-sm">No appointment history.</p>
      </div>
    </teleport>

    <!-- Add Client Modal -->
    <teleport to="body">
      <div v-if="showAddModal" class="overlay-backdrop" @click="showAddModal = false"></div>
      <div v-if="showAddModal" class="modal-content p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-dark-100 text-lg">Add New Client</h3>
          <button @click="showAddModal = false" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400"><X :size="18" /></button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Name *</label>
            <input v-model="newClient.name" type="text" class="input-field" placeholder="Full name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
            <input v-model="newClient.email" type="email" class="input-field" placeholder="email@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Phone</label>
            <input v-model="newClient.phone" type="tel" class="input-field" placeholder="(555) 000-0000" />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Notes</label>
            <textarea v-model="newClient.notes" class="input-field min-h-[60px] resize-none" placeholder="Any notes..."></textarea>
          </div>
        </div>
        <button class="btn-primary w-full mt-5" :disabled="!newClient.name.trim()" @click="addClient">Add Client</button>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { store, formatDate, formatTime } from '../../store'
import { UserPlus, Search, Phone, Mail, X } from 'lucide-vue-next'

const search = ref('')
const selectedClient = ref(null)
const showAddModal = ref(false)
const newClient = reactive({ name: '', email: '', phone: '', notes: '' })

const filteredClients = computed(() => {
  const q = search.value.toLowerCase().trim()
  return store.customers.filter(c => !q || c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q))
})

const clientHistory = computed(() => {
  if (!selectedClient.value) return []
  return store.appointments
    .filter(a => a.customerId === selectedClient.value.id || a.customerName === selectedClient.value.name)
    .sort((a, b) => b.date.localeCompare(a.date))
})

function clientAppointmentCount (id) {
  return store.appointments.filter(a => a.customerId === id && a.status !== 'cancelled').length
}

function getInitials (name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function addClient () {
  store.addCustomer({ ...newClient })
  Object.assign(newClient, { name: '', email: '', phone: '', notes: '' })
  showAddModal.value = false
}
</script>
