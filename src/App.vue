<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Desktop Sidebar (admin routes only) -->
    <AdminSidebar v-if="isAdminRoute" />

    <!-- Main Content -->
    <div :class="isAdminRoute ? 'md:ml-64' : ''">
      <!-- Top Header for admin -->
      <AdminHeader v-if="isAdminRoute" />

      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- Mobile Bottom Nav (public routes) -->
    <BottomNav v-if="!isAdminRoute" />

    <!-- Toast Notifications -->
    <teleport to="body">
      <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2" style="pointer-events: none;">
        <transition-group name="toast">
          <div
            v-for="toast in store.toasts"
            :key="toast.id"
            class="toast"
            style="pointer-events: auto;"
            :class="{
              'bg-green-500/15 border border-green-500/30 text-green-400': toast.type === 'success',
              'bg-red-500/15 border border-red-500/30 text-red-400': toast.type === 'error',
              'bg-amber-500/15 border border-amber-500/30 text-amber-400': toast.type === 'warning',
              'glass text-dark-100': toast.type === 'info',
            }"
          >
            {{ toast.message }}
          </div>
        </transition-group>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from './store'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminHeader from './components/AdminHeader.vue'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<style scoped>
.toast-enter-active { animation: fadeInUp 0.35s ease-out; }
.toast-leave-active { animation: fadeIn 0.2s ease-in reverse; }
</style>
