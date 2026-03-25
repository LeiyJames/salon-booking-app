<template>
  <div class="min-h-screen pb-24 px-5">
    <div class="max-w-xl mx-auto pt-10">
      <div class="text-center mb-8 animate-scale-in">
        <div class="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <CheckCircle :size="40" class="text-green-400" />
        </div>
        <h1 class="font-display text-2xl font-bold text-dark-100 mb-2">Booking Confirmed!</h1>
        <p class="text-dark-400">Your appointment has been scheduled successfully.</p>
      </div>

      <div v-if="appointment" class="card p-5 space-y-4 animate-fade-in-up delay-200">
        <div class="flex items-center justify-between">
          <span class="badge badge-success">Confirmed</span>
          <span class="text-xs text-dark-500 font-mono">{{ appointment.id }}</span>
        </div>
        <div class="flex items-start gap-3">
          <CalendarDays :size="18" class="text-gold-400 mt-0.5" />
          <div>
            <p class="text-xs text-dark-400">Date & Time</p>
            <p class="text-dark-100 font-medium">{{ formatDateLong(appointment.date) }}</p>
            <p class="text-dark-300 text-sm">{{ formatTime(appointment.time) }} – {{ formatTime(appointment.endTime) }}</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <Sparkles :size="18" class="text-gold-400 mt-0.5" />
          <div>
            <p class="text-xs text-dark-400">Services</p>
            <p v-for="svc in appointment.services" :key="svc.serviceId" class="text-dark-100 text-sm">{{ svc.name }}</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <UserCheck :size="18" class="text-gold-400 mt-0.5" />
          <div>
            <p class="text-xs text-dark-400">Stylist</p>
            <p class="text-dark-100 font-medium text-sm">{{ appointment.stylistName }}</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <MapPin :size="18" class="text-gold-400 mt-0.5" />
          <div>
            <p class="text-xs text-dark-400">Location</p>
            <p class="text-dark-100 font-medium text-sm">{{ locationName }}</p>
          </div>
        </div>
        <div class="border-t border-white/5 pt-3 flex justify-between items-center">
          <span class="text-dark-400 text-sm">Total</span>
          <span class="text-xl font-bold text-gold-400">{{ formatPrice(appointment.totalPrice) }}</span>
        </div>
      </div>

      <div class="mt-6 space-y-3 animate-fade-in-up delay-300">
        <router-link to="/" class="btn-primary w-full"><Home :size="18" /> Back to Home</router-link>
        <router-link to="/book" class="btn-secondary w-full">Book Another Appointment</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store, formatTime, formatDateLong, formatPrice } from '../store'
import { CheckCircle, CalendarDays, Sparkles, UserCheck, MapPin, Home } from 'lucide-vue-next'

const route = useRoute()
const appointment = computed(() => store.appointments.find(a => a.id === route.params.id))
const locationName = computed(() => {
  if (!appointment.value) return ''
  const loc = store.locations.find(l => l.id === appointment.value.locationId)
  return loc?.name || ''
})
</script>
