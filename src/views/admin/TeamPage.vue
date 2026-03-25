<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <h1 class="font-display text-2xl font-bold text-dark-100 mb-6">Team</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="stylist in store.locationStylists" :key="stylist.id" class="card p-5">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{{ getStylistInitials(stylist.name) }}</div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-dark-100 text-lg">{{ stylist.name }}</h3>
            <p class="text-dark-400 text-sm mb-2">{{ stylist.role }}</p>
            <div class="flex flex-wrap gap-1 mb-3">
              <span v-for="skill in stylist.skills" :key="skill" class="badge badge-gold text-[10px]">{{ skill }}</span>
            </div>
            <h4 class="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Weekly Schedule</h4>
            <div class="grid grid-cols-7 gap-1">
              <div v-for="day in weekDays" :key="day.key" class="text-center">
                <p class="text-[10px] text-dark-500 mb-1">{{ day.label }}</p>
                <div class="rounded-lg py-1 text-[9px] font-medium" :class="stylist.availability[day.key] ? 'bg-green-500/10 text-green-400' : 'bg-dark-700 text-dark-500'">
                  {{ stylist.availability[day.key] ? stylist.availability[day.key].start.slice(0,5) : 'Off' }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-3 text-xs text-dark-400">
              <MapPin :size="12" />
              <span>{{ stylist.locationIds.map(lid => store.locations.find(l => l.id === lid)?.name.replace('GlowUp Studio — ', '')).join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store, getStylistInitials } from '../../store'
import { MapPin } from 'lucide-vue-next'
const weekDays = [{ key: 'mon', label: 'Mo' }, { key: 'tue', label: 'Tu' }, { key: 'wed', label: 'We' }, { key: 'thu', label: 'Th' }, { key: 'fri', label: 'Fr' }, { key: 'sat', label: 'Sa' }, { key: 'sun', label: 'Su' }]
</script>
