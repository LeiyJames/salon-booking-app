<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-dark-100">Calendar</h1>
      <div class="flex items-center gap-2">
        <button @click="goToday" class="btn-secondary text-xs px-3 py-2">Today</button>
      </div>
    </div>

    <!-- Month Navigator -->
    <div class="card p-4 mb-5">
      <div class="flex items-center justify-between mb-4">
        <button @click="prevMonth" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400"><ChevronLeft :size="18" /></button>
        <span class="font-semibold text-dark-100 text-lg">{{ monthLabel }}</span>
        <button @click="nextMonth" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400"><ChevronRight :size="18" /></button>
      </div>

      <div class="calendar-grid mb-2">
        <div v-for="d in dayHeaders" :key="d" class="text-center text-xs font-medium text-dark-400 py-1">{{ d }}</div>
      </div>
      <div class="calendar-grid">
        <div v-for="(day, idx) in calendarDays" :key="idx"
          class="calendar-cell relative"
          :class="{
            'calendar-cell-selected': day.dateStr === selectedDate,
            'calendar-cell-today': day.isToday && day.dateStr !== selectedDate,
            'text-dark-100': day.day,
          }"
          @click="day.day && (selectedDate = day.dateStr)"
        >
          {{ day.day || '' }}
          <span v-if="dayHasAppointments(day.dateStr)" class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-gold-400"></span>
        </div>
      </div>
    </div>

    <!-- Day's Appointments -->
    <div>
      <h2 class="font-semibold text-dark-200 mb-3">{{ formatDateLong(selectedDate) }}</h2>

      <div v-if="dayAppointments.length === 0" class="card p-6 text-center">
        <p class="text-dark-400 text-sm">No appointments on this day.</p>
      </div>

      <div v-else class="space-y-2">
        <div v-for="apt in dayAppointments" :key="apt.id" class="card p-4">
          <div class="flex items-center gap-4">
            <div class="text-center flex-shrink-0 w-16">
              <p class="text-base font-bold text-dark-100">{{ formatTime(apt.time) }}</p>
              <p class="text-xs text-dark-500">{{ formatTime(apt.endTime) }}</p>
            </div>
            <div class="w-px h-10 bg-dark-600"></div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-dark-100 truncate">{{ apt.customerName }}</h3>
              <p class="text-sm text-dark-400 truncate">{{ apt.services.map(s => s.name).join(', ') }}</p>
              <p class="text-xs text-dark-500">{{ apt.stylistName }}</p>
            </div>
            <span
              class="badge text-[10px]"
              :class="{
                'badge-success': apt.status === 'confirmed',
                'badge-gold': apt.status === 'pending',
                'badge-danger': apt.status === 'cancelled',
              }"
            >
              {{ apt.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, formatTime, formatDate, formatDateLong } from '../../store'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const todayStr = new Date().toISOString().slice(0, 10)
const selectedDate = ref(todayStr)
const calendarMonth = ref(new Date().getMonth())
const calendarYear = ref(new Date().getFullYear())
const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const monthLabel = computed(() => new Date(calendarYear.value, calendarMonth.value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

const calendarDays = computed(() => {
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0)
  const startDow = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const cells = []
  for (let i = 0; i < startDow; i++) cells.push({ day: null, dateStr: '', isToday: false })
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calendarYear.value}-${String(calendarMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, dateStr, isToday: dateStr === todayStr })
  }
  return cells
})

const dayAppointments = computed(() =>
  store.appointments
    .filter(a => a.date === selectedDate.value && a.locationId === store.currentLocationId && a.status !== 'cancelled')
    .sort((a, b) => a.time.localeCompare(b.time))
)

function dayHasAppointments (dateStr) {
  return dateStr && store.appointments.some(a => a.date === dateStr && a.locationId === store.currentLocationId && a.status !== 'cancelled')
}

function prevMonth () { if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- } else calendarMonth.value-- }
function nextMonth () { if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ } else calendarMonth.value++ }
function goToday () { selectedDate.value = todayStr; calendarMonth.value = new Date().getMonth(); calendarYear.value = new Date().getFullYear() }
</script>
