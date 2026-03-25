<template>
  <div class="min-h-screen flex items-center justify-center px-5">
    <!-- Background effects -->
    <div class="absolute inset-0 bg-dark-900"></div>
    <div class="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

    <div class="relative z-10 w-full max-w-sm text-center">
      <!-- Logo -->
      <div class="mb-8 animate-fade-in-up">
        <div class="w-20 h-20 rounded-3xl gradient-gold flex items-center justify-center mx-auto mb-5 shadow-lg animate-pulse-glow">
          <Scissors :size="36" class="text-dark-900" />
        </div>
        <h1 class="font-display text-4xl font-bold text-dark-100 mb-2">
          GlowUp <span class="text-gold-400">Studio</span>
        </h1>
        <p class="text-dark-400 text-sm">Premium grooming & styling, tailored to you.</p>
      </div>

      <!-- Role Selection -->
      <div class="space-y-3 animate-fade-in-up delay-200">
        <p class="text-dark-300 text-sm font-medium mb-4">Continue as</p>

        <button
          @click="loginAs('customer')"
          class="w-full card p-5 flex items-center gap-4 group card-interactive hover:border-gold-500/30 transition-all"
        >
          <div class="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <User :size="26" class="text-gold-400" />
          </div>
          <div class="text-left flex-1">
            <h3 class="font-semibold text-dark-100 text-lg">Customer</h3>
            <p class="text-dark-400 text-sm">Browse services & book appointments</p>
          </div>
          <ChevronRight :size="20" class="text-dark-500 group-hover:text-gold-400 transition-colors" />
        </button>

        <button
          @click="loginAs('admin')"
          class="w-full card p-5 flex items-center gap-4 group card-interactive hover:border-accent-500/30 transition-all"
        >
          <div class="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck :size="26" class="text-accent-400" />
          </div>
          <div class="text-left flex-1">
            <h3 class="font-semibold text-dark-100 text-lg">Admin</h3>
            <p class="text-dark-400 text-sm">Manage bookings, staff & services</p>
          </div>
          <ChevronRight :size="20" class="text-dark-500 group-hover:text-accent-400 transition-colors" />
        </button>
      </div>

      <p class="text-dark-500 text-xs mt-8 animate-fade-in-up delay-300">
        This is a demo. No real authentication is required.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { store } from '../store'
import { Scissors, User, ShieldCheck, ChevronRight } from 'lucide-vue-next'

const router = useRouter()

function loginAs (role) {
  store.login(role)
  if (role === 'admin') {
    router.push('/admin')
  } else {
    router.push('/')
  }
}
</script>
