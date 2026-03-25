<template>
  <div class="min-h-screen pb-24">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-900"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      <div class="relative px-5 pt-14 pb-12 max-w-xl mx-auto text-center">
        <!-- Logo -->
        <div class="inline-flex items-center gap-2 mb-6 animate-fade-in-up">
          <div class="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center shadow-lg animate-pulse-glow">
            <Scissors :size="24" class="text-dark-900" />
          </div>
        </div>

        <h1 class="font-display text-4xl md:text-5xl font-bold text-dark-100 mb-3 animate-fade-in-up delay-100">
          GlowUp <span class="text-gold-400">Studio</span>
        </h1>

        <p class="text-dark-300 text-lg mb-8 animate-fade-in-up delay-200">
          Premium grooming & styling, tailored to you.
        </p>

        <router-link
          to="/book"
          class="btn-primary text-base px-8 py-3.5 animate-fade-in-up delay-300 inline-flex"
        >
          <CalendarPlus :size="20" />
          Book Appointment
        </router-link>
      </div>
    </section>

    <!-- Location Selector -->
    <section class="px-5 -mt-4 max-w-xl mx-auto">
      <div class="animate-fade-in-up delay-400">
        <h2 class="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">Our Locations</h2>
        <div class="space-y-3">
          <div
            v-for="loc in store.locations"
            :key="loc.id"
            class="card card-interactive group"
            @click="selectLocation(loc.id)"
          >
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                :class="store.currentLocationId === loc.id ? 'gradient-gold' : 'bg-dark-600'"
              >
                <MapPin :size="22" :class="store.currentLocationId === loc.id ? 'text-dark-900' : 'text-dark-300'" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold text-dark-100 text-[15px]">{{ loc.name.replace('GlowUp Studio — ', '') }}</h3>
                  <span v-if="store.currentLocationId === loc.id" class="badge badge-gold text-[10px]">Selected</span>
                </div>
                <p class="text-dark-400 text-sm">{{ loc.address }}</p>
                <div class="flex items-center gap-3 mt-2 text-xs text-dark-400">
                  <span class="flex items-center gap-1"><Clock :size="12" /> {{ loc.hours }}</span>
                  <span class="flex items-center gap-1"><Phone :size="12" /> {{ loc.phone }}</span>
                </div>
              </div>
              <ChevronRight :size="18" class="text-dark-500 group-hover:text-gold-400 transition-colors mt-1" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Services Preview -->
    <section class="px-5 mt-8 max-w-xl mx-auto animate-fade-in-up delay-500">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-dark-400 uppercase tracking-wider">Popular Services</h2>
        <router-link to="/book" class="text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors flex items-center gap-1">
          View All <ArrowRight :size="14" />
        </router-link>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="service in topServices"
          :key="service.id"
          class="card p-4 group cursor-pointer"
          @click="bookService(service)"
        >
          <div class="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center mb-3">
            <Sparkles :size="18" class="text-gold-400" />
          </div>
          <h3 class="font-medium text-dark-100 text-sm mb-1">{{ service.name }}</h3>
          <div class="flex items-center justify-between text-xs text-dark-400">
            <span>{{ service.duration }} min</span>
            <span class="font-semibold text-gold-400">{{ formatPrice(service.price) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="px-5 mt-8 max-w-xl mx-auto mb-8">
      <div class="grid grid-cols-2 gap-3">
        <router-link to="/manage" class="card p-4 flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
            <Search :size="18" class="text-accent-400" />
          </div>
          <div>
            <h3 class="font-medium text-dark-100 text-sm">Manage Booking</h3>
            <p class="text-dark-400 text-xs">View or change</p>
          </div>
        </router-link>
        <router-link to="/admin" class="card p-4 flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center">
            <LayoutDashboard :size="18" class="text-dark-300" />
          </div>
          <div>
            <h3 class="font-medium text-dark-100 text-sm">Staff Portal</h3>
            <p class="text-dark-400 text-xs">Admin access</p>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store, formatPrice } from '../store'
import {
  Scissors, CalendarPlus, MapPin, Clock, Phone, ChevronRight,
  ArrowRight, Sparkles, Search, LayoutDashboard
} from 'lucide-vue-next'

const router = useRouter()

const topServices = computed(() => store.locationServices.slice(0, 4))

function selectLocation (id) {
  store.currentLocationId = id
  router.push('/book')
}

function bookService (service) {
  router.push({ path: '/book', query: { service: service.id } })
}
</script>
