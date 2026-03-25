<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <h1 class="font-display text-2xl font-bold text-dark-100 mb-6">Locations</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="loc in store.locations" :key="loc.id" class="card p-5">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" :class="store.currentLocationId === loc.id ? 'gradient-gold' : 'bg-dark-600'">
            <MapPin :size="22" :class="store.currentLocationId === loc.id ? 'text-dark-900' : 'text-dark-300'" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-dark-100">{{ loc.name }}</h3>
              <span v-if="store.currentLocationId === loc.id" class="badge badge-gold text-[10px]">Active</span>
            </div>
            <p class="text-dark-400 text-sm mb-2">{{ loc.address }}</p>
            <div class="space-y-1 text-sm text-dark-400">
              <div class="flex items-center gap-2"><Phone :size="14" /> {{ loc.phone }}</div>
              <div class="flex items-center gap-2"><Clock :size="14" /> {{ loc.hours }}</div>
            </div>
            <div class="mt-3 flex items-center gap-3 text-xs text-dark-400">
              <span><strong class="text-dark-200">{{ locationStaffCount(loc.id) }}</strong> Staff</span>
              <span><strong class="text-dark-200">{{ locationServiceCount(loc.id) }}</strong> Services</span>
            </div>
            <button v-if="store.currentLocationId !== loc.id" class="btn-secondary text-xs px-3 py-2 mt-3" @click="store.currentLocationId = loc.id">Switch to this location</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store } from '../../store'
import { MapPin, Phone, Clock } from 'lucide-vue-next'
function locationStaffCount (locId) { return store.stylists.filter(s => s.locationIds.includes(locId)).length }
function locationServiceCount (locId) { return store.services.filter(s => s.locationIds.includes(locId)).length }
</script>
