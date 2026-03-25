<template>
  <nav class="bottom-nav px-2 py-1">
    <div class="flex items-center justify-around max-w-lg mx-auto">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-colors min-w-[64px]"
        :class="isActive(item.path) ? 'text-gold-400' : 'text-dark-400 hover:text-dark-200'"
      >
        <component :is="item.icon" :size="22" :stroke-width="isActive(item.path) ? 2.5 : 1.8" />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Home, Scissors, CalendarDays, Search } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Book', path: '/book', icon: Scissors },
  { label: 'My Bookings', path: '/manage', icon: CalendarDays },
]

function isActive (path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
