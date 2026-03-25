<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <!-- Welcome -->
    <div class="mb-6 animate-fade-in-up">
      <h1 class="font-display text-2xl md:text-3xl font-bold text-dark-100 mb-1">
        Good {{ greeting }}, Admin
      </h1>
      <p class="text-dark-400">Here's what's happening at {{ store.currentLocation?.name?.replace('GlowUp Studio — ', '') }} today.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div v-for="(stat, i) in stats" :key="stat.label" class="card p-4 animate-fade-in-up" :style="{ animationDelay: `${i * 80}ms` }">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="stat.bgClass">
            <component :is="stat.icon" :size="18" :class="stat.iconClass" />
          </div>
        </div>
        <p class="text-2xl font-bold text-dark-100">{{ stat.value }}</p>
        <p class="text-xs text-dark-400 mt-0.5">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Today's Appointments -->
    <div class="animate-fade-in-up delay-300">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-dark-100 text-lg">Today's Appointments</h2>
        <router-link to="/admin/appointments" class="text-gold-400 text-sm font-medium hover:text-gold-300 flex items-center gap-1">
          View All <ArrowRight :size="14" />
        </router-link>
      </div>

      <div v-if="store.todayAppointments.length === 0" class="card p-8 text-center">
        <CalendarDays :size="36" class="text-dark-500 mx-auto mb-2" />
        <p class="text-dark-400">No appointments today.</p>
      </div>

      <div v-else class="space-y-2">
        <div v-for="apt in store.todayAppointments" :key="apt.id" class="card p-4">
          <div class="flex items-center gap-4">
            <!-- Time -->
            <div class="text-center flex-shrink-0 w-16">
              <p class="text-lg font-bold text-dark-100">{{ formatTime(apt.time) }}</p>
              <p class="text-xs text-dark-500">{{ apt.totalDuration }}m</p>
            </div>

            <div class="w-px h-12 bg-dark-600"></div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <h3 class="font-medium text-dark-100 truncate">{{ apt.customerName }}</h3>
                <span
                  class="badge text-[10px]"
                  :class="{
                    'badge-success': apt.paymentStatus === 'paid',
                    'badge-danger': apt.paymentStatus === 'unpaid',
                  }"
                >
                  {{ apt.paymentStatus }}
                </span>
              </div>
              <p class="text-sm text-dark-400 truncate">
                {{ apt.services.map(s => s.name).join(', ') }}
              </p>
              <p class="text-xs text-dark-500 mt-0.5">with {{ apt.stylistName }}</p>
            </div>

            <!-- Price -->
            <div class="text-right flex-shrink-0">
              <p class="font-semibold text-gold-400">{{ formatPrice(apt.totalPrice) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up delay-400">
      <router-link to="/book" class="card p-4 flex items-center gap-3 group card-interactive">
        <div class="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
          <Plus :size="18" class="text-gold-400" />
        </div>
        <span class="text-sm font-medium text-dark-200">New Booking</span>
      </router-link>
      <router-link to="/admin/clients" class="card p-4 flex items-center gap-3 group card-interactive">
        <div class="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
          <UserPlus :size="18" class="text-accent-400" />
        </div>
        <span class="text-sm font-medium text-dark-200">Add Client</span>
      </router-link>
      <router-link to="/admin/calendar" class="card p-4 flex items-center gap-3 group card-interactive">
        <div class="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center">
          <CalendarDays :size="18" class="text-dark-300" />
        </div>
        <span class="text-sm font-medium text-dark-200">Calendar</span>
      </router-link>
      <router-link to="/admin/services" class="card p-4 flex items-center gap-3 group card-interactive">
        <div class="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center">
          <Sparkles :size="18" class="text-dark-300" />
        </div>
        <span class="text-sm font-medium text-dark-200">Services</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, formatTime, formatPrice } from '../../store'
import {
  CalendarDays, ArrowRight, Plus, UserPlus, Sparkles,
  Users, DollarSign, Clock, TrendingUp
} from 'lucide-vue-next'

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})

const todayStr = new Date().toISOString().slice(0, 10)

const stats = computed(() => [
  {
    label: "Today's Bookings",
    value: store.todayAppointments.length,
    icon: CalendarDays,
    bgClass: 'bg-gold-500/10',
    iconClass: 'text-gold-400',
  },
  {
    label: 'Upcoming',
    value: store.upcomingAppointments.length,
    icon: TrendingUp,
    bgClass: 'bg-accent-500/10',
    iconClass: 'text-accent-400',
  },
  {
    label: 'Total Clients',
    value: store.customers.length,
    icon: Users,
    bgClass: 'bg-green-500/10',
    iconClass: 'text-green-400',
  },
  {
    label: "Today's Revenue",
    value: formatPrice(
      store.todayAppointments
        .filter(a => a.paymentStatus === 'paid')
        .reduce((sum, a) => sum + a.totalPrice, 0)
    ),
    icon: DollarSign,
    bgClass: 'bg-amber-500/10',
    iconClass: 'text-amber-400',
  },
])
</script>
