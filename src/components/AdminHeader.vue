<template>
  <header class="sticky top-0 z-30 glass px-4 py-3 md:px-6 flex items-center justify-between">
    <!-- Mobile menu button -->
    <button class="md:hidden p-2 rounded-lg hover:bg-dark-700 text-dark-300" @click="mobileMenuOpen = !mobileMenuOpen">
      <Menu :size="22" />
    </button>

    <div class="flex items-center gap-3">
      <h2 class="text-lg font-semibold text-dark-100">{{ pageTitle }}</h2>
    </div>

    <div class="flex items-center gap-2">
      <button class="p-2 rounded-lg hover:bg-dark-700 text-dark-300 relative">
        <Bell :size="20" />
        <span v-if="store.notifications.length" class="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
      </button>
    </div>

    <!-- Mobile sidebar overlay -->
    <teleport to="body">
      <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 z-50">
        <div class="overlay-backdrop" @click="mobileMenuOpen = false"></div>
        <div class="fixed left-0 top-0 bottom-0 w-72 bg-dark-800 z-60 animate-slide-right">
          <div class="p-5 border-b border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                <Scissors :size="18" class="text-dark-900" />
              </div>
              <span class="font-display text-lg font-semibold text-dark-100">GlowUp</span>
            </div>
            <button @click="mobileMenuOpen = false" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400">
              <X :size="20" />
            </button>
          </div>

          <div class="px-4 py-3 border-b border-white/5">
            <select v-model="store.currentLocationId" class="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm text-dark-200 focus:outline-none focus:border-gold-500">
              <option v-for="loc in store.locations" :key="loc.id" :value="loc.id">
                {{ loc.name.replace('GlowUp Studio — ', '') }}
              </option>
            </select>
          </div>

          <nav class="py-3 px-3 space-y-0.5">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all"
              :class="route.path === item.path ? 'bg-gold-500/10 text-gold-400' : 'text-dark-300 hover:bg-dark-700'"
            >
              <component :is="item.icon" :size="18" />
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </div>
      </div>
    </teleport>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../store'
import {
  Menu, Bell, X, Scissors,
  LayoutDashboard, CalendarDays, ClipboardList,
  Users, Sparkles, UserCog, MapPin, Settings
} from 'lucide-vue-next'

const route = useRoute()
const mobileMenuOpen = ref(false)

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

const titleMap = {
  '/admin': 'Dashboard',
  '/admin/calendar': 'Calendar',
  '/admin/appointments': 'Appointments',
  '/admin/clients': 'Clients',
  '/admin/services': 'Services',
  '/admin/team': 'Team',
  '/admin/locations': 'Locations',
  '/admin/settings': 'Settings',
}

const pageTitle = computed(() => titleMap[route.path] || 'Dashboard')
</script>
