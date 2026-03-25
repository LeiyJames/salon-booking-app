<template>
  <div class="min-h-screen pb-24">
    <!-- Header -->
    <div class="glass sticky top-0 z-20 px-5 py-3">
      <div class="max-w-xl mx-auto flex items-center justify-between">
        <button @click="router.back()" class="p-2 -ml-2 rounded-lg hover:bg-dark-700 text-dark-300">
          <ArrowLeft :size="20" />
        </button>
        <h1 class="font-semibold text-dark-100">Manage Booking</h1>
        <div class="w-9"></div> <!-- Spacer to balance the title -->
      </div>
    </div>

    <div class="max-w-xl mx-auto pt-6 px-5 text-center">
      <h2 class="font-display text-2xl font-bold text-dark-100 mb-2">Your Appointments</h2>
      <p class="text-dark-400 text-sm mb-6">Look up your appointment to view, cancel, or reschedule.</p>

      <div class="relative mb-6">
        <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
        <input v-model="searchQuery" type="text" class="input-field pl-10" placeholder="Search by name, ID, or phone..." />
      </div>

      <div v-if="filteredAppointments.length" class="space-y-3">
        <div v-for="apt in filteredAppointments" :key="apt.id" class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="badge" :class="{ 'badge-success': apt.status === 'confirmed', 'badge-gold': apt.status === 'pending', 'badge-danger': apt.status === 'cancelled' }">{{ apt.status }}</span>
            <span class="text-xs text-dark-500 font-mono">{{ apt.id }}</span>
          </div>
          <h3 class="font-medium text-dark-100 mb-1">{{ apt.customerName }}</h3>
          <div class="flex items-center gap-4 text-sm text-dark-400 mb-3">
            <span class="flex items-center gap-1"><CalendarDays :size="14" /> {{ formatDate(apt.date) }}</span>
            <span class="flex items-center gap-1"><Clock :size="14" /> {{ formatTime(apt.time) }}</span>
            <span class="font-medium text-gold-400">{{ formatPrice(apt.totalPrice) }}</span>
          </div>
          <div class="text-sm text-dark-300 mb-3">
            <span v-for="(svc, i) in apt.services" :key="svc.serviceId">{{ svc.name }}<span v-if="i < apt.services.length - 1">, </span></span>
            <span class="text-dark-500"> · </span><span>{{ apt.stylistName }}</span>
          </div>
          <div v-if="apt.status !== 'cancelled'" class="flex gap-2">
            <button class="btn-danger text-xs px-3 py-2" @click="cancelApt(apt.id)"><XCircle :size="14" /> Cancel</button>
            <button class="btn-secondary text-xs px-3 py-2" @click="openReschedule(apt)"><RefreshCw :size="14" /> Reschedule</button>
          </div>
        </div>
      </div>

      <div v-else class="card p-8 text-center">
        <CalendarX :size="40" class="text-dark-500 mx-auto mb-3" />
        <p class="text-dark-400">No appointments found.</p>
        <router-link to="/book" class="btn-primary mt-4 inline-flex">Book Now</router-link>
      </div>

      <teleport to="body">
        <div v-if="rescheduleApt" class="overlay-backdrop" @click="rescheduleApt = null"></div>
        <div v-if="rescheduleApt" class="modal-content p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-dark-100 text-lg">Reschedule Appointment</h3>
            <button @click="rescheduleApt = null" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400"><X :size="18" /></button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">New Date</label>
              <input v-model="newDate" type="date" class="input-field" :min="todayStr" />
            </div>
            <div v-if="rescheduleSlots.length > 0">
              <label class="block text-sm font-medium text-dark-300 mb-1.5">New Time</label>
              <div class="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                <div v-for="slot in rescheduleSlots" :key="slot.time" class="time-slot" :class="{ 'time-slot-selected': newTime === slot.time }" @click="newTime = slot.time; newEndTime = slot.endTime">
                  {{ formatTime(slot.time) }}
                </div>
              </div>
            </div>
            <div v-else-if="newDate" class="text-center py-4 text-dark-400 text-sm">No slots available on this date.</div>
          </div>
          <button class="btn-primary w-full mt-5" :disabled="!newDate || !newTime" :class="{ 'opacity-50': !newDate || !newTime }" @click="doReschedule">Confirm Reschedule</button>
        </div>
      </teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store, formatDate, formatTime, formatPrice } from '../store'
import { ArrowLeft, Search, CalendarDays, Clock, XCircle, RefreshCw, CalendarX, X } from 'lucide-vue-next'

const router = useRouter()

const searchQuery = ref('')
const rescheduleApt = ref(null)
const newDate = ref('')
const newTime = ref('')
const newEndTime = ref('')
const todayStr = new Date().toISOString().slice(0, 10)

const filteredAppointments = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return store.appointments
    .filter(a => !q || a.customerName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || (a.services && a.services.some(s => s.name.toLowerCase().includes(q))))
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
})

const rescheduleSlots = computed(() => {
  if (!rescheduleApt.value || !newDate.value) return []
  return store.getAvailableSlots(rescheduleApt.value.stylistId, newDate.value, rescheduleApt.value.totalDuration)
})

function cancelApt (id) { if (confirm('Cancel this appointment?')) store.cancelAppointment(id) }
function openReschedule (apt) { rescheduleApt.value = apt; newDate.value = ''; newTime.value = ''; newEndTime.value = '' }
function doReschedule () { store.rescheduleAppointment(rescheduleApt.value.id, newDate.value, newTime.value, newEndTime.value); rescheduleApt.value = null }
</script>
