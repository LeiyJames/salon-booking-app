<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Admin sidebar (desktop) -->
    <AdminSidebar v-if="isAdminRoute && !isLoginRoute" />

    <div :class="isAdminRoute && !isLoginRoute ? 'md:ml-64' : ''">
      <!-- Admin header (mobile) -->
      <AdminHeader v-if="isAdminRoute && !isLoginRoute" />

      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- Bottom nav (customer pages only, not on booking/login) -->
    <BottomNav v-if="showBottomNav" />

    <!-- Floating logout button -->
    <button
      v-if="store.isLoggedIn && !isLoginRoute"
      @click="handleLogout"
      class="fixed top-4 right-4 z-50 p-2 rounded-xl glass text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
      title="Logout"
    >
      <LogOut :size="18" />
    </button>

    <!-- Toast notifications -->
    <teleport to="body">
      <div class="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 z-[100] flex flex-col gap-2" style="pointer-events: none;">
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
import { useRoute, useRouter } from 'vue-router'
import { store } from './store'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminHeader from './components/AdminHeader.vue'
import BottomNav from './components/BottomNav.vue'
import { LogOut } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isLoginRoute = computed(() => route.path === '/login')
const hideBottomNavRoutes = ['/book', '/booking', '/manage', '/login']
const showBottomNav = computed(() => !isAdminRoute.value && !hideBottomNavRoutes.some(r => route.path.startsWith(r)) && store.isLoggedIn)

function handleLogout () {
  store.logout()
  router.push('/login')
}
</script>

<style scoped>
.toast-enter-active { animation: fadeInUp 0.35s ease-out; }
.toast-leave-active { animation: fadeIn 0.2s ease-in reverse; }
</style>
