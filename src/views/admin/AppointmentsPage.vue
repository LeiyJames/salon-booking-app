<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-dark-100">Appointments</h1>
      <router-link to="/book" class="btn-primary text-sm"><Plus :size="16" /> New Booking</router-link>
    </div>
    <div class="flex gap-2 overflow-x-auto pb-3 mb-4">
      <button v-for="f in filters" :key="f.value" class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
        :class="activeFilter === f.value ? 'gradient-gold text-dark-900' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'" @click="activeFilter = f.value">{{ f.label }}</button>
    </div>
    <div v-if="filtered.length" class="space-y-2">
      <div v-for="apt in filtered" :key="apt.id" class="card p-4">
        <div class="flex items-start gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-medium text-dark-100">{{ apt.customerName }}</h3>
              <span class="badge text-[10px]" :class="{ 'badge-success': apt.status === 'confirmed', 'badge-gold': apt.status === 'pending', 'badge-danger': apt.status === 'cancelled' }">{{ apt.status }}</span>
              <span class="badge text-[10px]" :class="{ 'badge-success': apt.paymentStatus === 'paid', 'badge-danger': apt.paymentStatus === 'unpaid', 'badge-accent': apt.paymentStatus === 'refunded' }">{{ apt.paymentStatus }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-dark-400 mb-1">
              <span class="flex items-center gap-1"><CalendarDays :size="14" /> {{ formatDate(apt.date) }}</span>
              <span class="flex items-center gap-1"><Clock :size="14" /> {{ formatTime(apt.time) }} - {{ formatTime(apt.endTime) }}</span>
            </div>
            <p class="text-sm text-dark-300">{{ apt.services.map(s => s.name).join(', ') }} · {{ apt.stylistName }}</p>
          </div>
          <div class="flex flex-col items-end gap-2 flex-shrink-0">
            <span class="font-semibold text-gold-400">{{ formatPrice(apt.totalPrice) }}</span>
            <div class="flex gap-1" v-if="apt.status !== 'cancelled'">
              <button v-if="apt.paymentStatus === 'unpaid'" class="text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition" @click="store.markPayment(apt.id, 'paid')">Mark Paid</button>
              <button class="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition" @click="store.cancelAppointment(apt.id)">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="card p-8 text-center"><p class="text-dark-400">No appointments match the current filter.</p></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, formatDate, formatTime, formatPrice } from '../../store'
import { Plus, CalendarDays, Clock } from 'lucide-vue-next'

const activeFilter = ref('all')
const filters = [{ label: 'All', value: 'all' }, { label: 'Confirmed', value: 'confirmed' }, { label: 'Pending', value: 'pending' }, { label: 'Cancelled', value: 'cancelled' }, { label: 'Unpaid', value: 'unpaid' }]
const filtered = computed(() => {
  let list = store.appointments.filter(a => a.locationId === store.currentLocationId)
  if (activeFilter.value === 'unpaid') list = list.filter(a => a.paymentStatus === 'unpaid' && a.status !== 'cancelled')
  else if (activeFilter.value !== 'all') list = list.filter(a => a.status === activeFilter.value)
  return list.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
})
</script>
