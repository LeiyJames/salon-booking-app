<template>
  <aside class="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-dark-800 border-r border-white/5 z-40">
    <!-- Logo -->
    <div class="p-5 border-b border-white/5">
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
          <Scissors :size="20" class="text-dark-900" />
        </div>
        <div>
          <h1 class="font-display text-lg font-semibold text-dark-100">GlowUp</h1>
          <p class="text-[10px] text-dark-400 tracking-wider uppercase">Studio Admin</p>
        </div>
      </router-link>
    </div>

    <!-- Location Switcher -->
    <div class="px-4 py-3 border-b border-white/5">
      <select
        v-model="store.currentLocationId"
        class="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm text-dark-200 focus:outline-none focus:border-gold-500"
      >
        <option v-for="loc in store.locations" :key="loc.id" :value="loc.id">
          {{ loc.name.replace('GlowUp Studio — ', '') }}
        </option>
      </select>
    </div>

    <!-- Nav Links -->
    <nav class="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
        :class="isActive(item.path) ? 'bg-gold-500/10 text-gold-400' : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'"
      >
        <component :is="item.icon" :size="18" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Bottom user area -->
    <div class="p-4 border-t border-white/5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold">
          AD
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-dark-100 truncate">{{ store.currentUser.name }}</p>
          <p class="text-xs text-dark-400 capitalize">{{ store.currentUser.role.replace('_', ' ') }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { store } from '../store'
import {
  Scissors, LayoutDashboard, CalendarDays, ClipboardList,
  Users, Sparkles, UserCog, MapPin, Settings
} from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Calendar', path: '/admin/calendar', icon: CalendarDays },
  { label: 'Appointments', path: '/admin/appointments', icon: ClipboardList },
  { label: 'Clients', path: '/admin/clients', icon: Users },
  { label: 'Services', path: '/admin/services', icon: Sparkles },
  { label: 'Team', path: '/admin/team', icon: UserCog },
  { label: 'Locations', path: '/admin/locations', icon: MapPin },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
]

function isActive (path) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>
