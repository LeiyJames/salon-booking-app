<template>
  <div class="min-h-screen pb-28">
    <!-- Header -->
    <div class="glass sticky top-0 z-20 px-5 py-3">
      <div class="max-w-xl mx-auto flex items-center justify-between">
        <button @click="handleBack" class="p-2 -ml-2 rounded-lg hover:bg-dark-700 text-dark-300">
          <ArrowLeft :size="20" />
        </button>
        <h1 class="font-semibold text-dark-100">Book Appointment</h1>
        <div class="w-9"></div>
      </div>
    </div>

    <!-- Stepper Indicator -->
    <div class="px-5 py-4 max-w-xl mx-auto">
      <div class="flex items-center gap-1">
        <template v-for="(label, idx) in stepLabels" :key="idx">
          <div class="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              class="stepper-dot flex items-center justify-center"
              :class="{
                'stepper-dot-completed bg-gold-500': idx < step,
                'stepper-dot-active border-gold-500 bg-dark-800': idx === step,
                'stepper-dot-pending border-dark-600 bg-dark-900': idx > step,
              }"
            >
              <Check v-if="idx < step" :size="12" class="text-dark-900 stroke-[3px]" />
            </div>
            <span class="text-[10px] font-medium" :class="idx <= step ? 'text-gold-400' : 'text-dark-500'">{{ label }}</span>
          </div>
          <div v-if="idx < stepLabels.length - 1" class="stepper-line" :class="idx < step ? 'bg-gold-500' : 'bg-dark-600'"></div>
        </template>
      </div>
    </div>

    <div class="px-5 max-w-xl mx-auto">
      <!-- STEP 0: Select Services -->
      <div v-if="step === 0" class="animate-fade-in-up">
        <h2 class="text-xl font-semibold text-dark-100 mb-1">Choose Services</h2>
        <p class="text-dark-400 text-sm mb-5">Select one or more services</p>

        <div class="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
          <button
            v-for="cat in categories"
            :key="cat"
            class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
            :class="activeCategory === cat ? 'gradient-gold text-dark-900' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="service in filteredServices"
            :key="service.id"
            class="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2"
            :class="isServiceSelected(service.id) 
              ? 'border-gold-500 bg-gold-500/5 shadow-[0_10px_30px_-10px_rgba(201,164,86,0.3)]' 
              : 'border-dark-700 bg-dark-800 hover:border-dark-500 hover:shadow-xl hover:-translate-y-1'"
            @click="toggleService(service)"
          >
            <!-- Service Image Container -->
            <div class="relative h-44 overflow-hidden">
              <img 
                :src="service.image" 
                :alt="service.name" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <!-- Dark Overlay Gradient -->
              <div class="absolute inset-0 bg-linear-to-t from-dark-900 via-dark-900/20 to-transparent"></div>
              
              <!-- Category Badge -->
              <div class="absolute top-3 left-3">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-md border border-white/10 text-gold-400">
                  {{ service.category }}
                </span>
              </div>

              <!-- Selection Indicator -->
              <div 
                class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2"
                :class="isServiceSelected(service.id) 
                  ? 'bg-gold-500 border-gold-500 scale-110 shadow-[0_0_15px_rgba(201,164,86,0.5)]' 
                  : 'bg-black/20 border-white/30 backdrop-blur-md'"
              >
                <Check v-if="isServiceSelected(service.id)" :size="18" class="text-dark-900 stroke-[3px]" />
              </div>

              <!-- Bottom Info (Inside Image for more premium look) -->
              <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div class="flex items-center gap-1.5 text-xs font-medium text-dark-100 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/5">
                  <Clock :size="12" class="text-gold-400" />
                  {{ service.duration }} min
                </div>
              </div>
            </div>

            <!-- Content Area -->
            <div class="p-4">
              <h3 class="font-bold text-dark-100 group-hover:text-gold-400 transition-colors leading-tight mb-1">
                {{ service.name }}
              </h3>
              <p class="text-2xl font-black text-gold-400 leading-none">
                {{ formatPrice(service.price) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 1: Select Stylist -->
      <div v-if="step === 1" class="animate-fade-in-up">
        <h2 class="text-xl font-semibold text-dark-100 mb-1">Choose Stylist</h2>
        <p class="text-dark-400 text-sm mb-5">Pick your preferred stylist</p>

        <div
          class="card p-4 mb-3 cursor-pointer transition-all"
          :class="selectedStylistId === 'any' ? 'border-gold-500/40 bg-gold-500/5' : ''"
          @click="selectedStylistId = 'any'"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-dark-600 flex items-center justify-center">
              <Shuffle :size="20" class="text-dark-300" />
            </div>
            <div>
              <h3 class="font-medium text-dark-100">Any Available</h3>
              <p class="text-sm text-dark-400">First available stylist</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="stylist in availableStylists"
            :key="stylist.id"
            class="card p-4 cursor-pointer transition-all"
            :class="selectedStylistId === stylist.id ? 'border-gold-500/40 bg-gold-500/5' : ''"
            @click="selectedStylistId = stylist.id"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white font-bold text-sm">
                {{ getStylistInitials(stylist.name) }}
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-dark-100">{{ stylist.name }}</h3>
                <p class="text-sm text-dark-400">{{ stylist.role }}</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="skill in stylist.skills" :key="skill" class="badge badge-gold text-[10px]">{{ skill }}</span>
                </div>
              </div>
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                :class="selectedStylistId === stylist.id ? 'border-gold-500 bg-gold-500' : 'border-dark-500'"
              >
                <Check v-if="selectedStylistId === stylist.id" :size="14" class="text-dark-900" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 2: Select Date & Time -->
      <div v-if="step === 2" class="animate-fade-in-up">
        <h2 class="text-xl font-semibold text-dark-100 mb-1">Select Date & Time</h2>
        <p class="text-dark-400 text-sm mb-5">Choose your preferred slot</p>

        <div class="card p-4 mb-5">
          <div class="flex items-center justify-between mb-4">
            <button @click="prevMonth" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400">
              <ChevronLeft :size="18" />
            </button>
            <span class="font-semibold text-dark-100">{{ monthLabel }}</span>
            <button @click="nextMonth" class="p-2 rounded-lg hover:bg-dark-700 text-dark-400">
              <ChevronRight :size="18" />
            </button>
          </div>

          <div class="calendar-grid mb-2">
            <div v-for="d in dayHeaders" :key="d" class="text-center text-xs font-medium text-dark-400 py-1">{{ d }}</div>
          </div>

          <div class="calendar-grid">
            <div v-for="(day, idx) in calendarDays" :key="idx"
              class="calendar-cell"
              :class="{
                'calendar-cell-selected': day.dateStr === selectedDate,
                'calendar-cell-today': day.isToday && day.dateStr !== selectedDate,
                'calendar-cell-disabled': !day.selectable,
                'text-dark-100': day.selectable && day.dateStr !== selectedDate,
              }"
              @click="day.selectable && (selectedDate = day.dateStr)"
            >
              {{ day.day || '' }}
            </div>
          </div>
        </div>

        <div v-if="selectedDate">
          <h3 class="font-medium text-dark-200 mb-3">Available Times</h3>
          <div v-if="timeSlots.length === 0" class="card p-6 text-center">
            <CalendarX :size="32" class="text-dark-500 mx-auto mb-2" />
            <p class="text-dark-400 text-sm">No available slots for this date.</p>
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div
              v-for="slot in timeSlots"
              :key="slot.time"
              class="time-slot relative flex flex-col items-center justify-center py-4 px-2 h-20 transition-all border-2"
              :class="{
                'time-slot-selected border-gold-500 bg-gold-500/20 shadow-[0_0_15px_rgba(201,164,86,0.2)]': selectedTime === slot.time,
                'border-transparent bg-dark-700 hover:bg-dark-600': slot.status === 'available' && selectedTime !== slot.time,
                'border-green-500/30 bg-green-500/5 opacity-80 cursor-not-allowed': slot.status === 'booked',
                'border-amber-500/30 bg-amber-500/5 opacity-80 cursor-not-allowed': slot.status === 'pending'
              }"
              @click="slot.status === 'available' && (selectedTime = slot.time, selectedEndTime = slot.endTime)"
            >
              <span class="text-sm font-bold" :class="selectedTime === slot.time ? 'text-white' : 'text-dark-100'">
                {{ formatTime(slot.time) }}
              </span>

              <div v-if="slot.status === 'booked'" class="mt-1 flex items-center gap-1 text-[10px] font-bold text-green-400 uppercase tracking-tighter">
                <CheckCircle2 :size="10" /> Taken
              </div>
              <div v-else-if="slot.status === 'pending'" class="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-tighter">
                <Clock :size="10" /> Pending
              </div>
              <div v-else class="mt-1 text-[10px] text-dark-400 uppercase tracking-tighter">
                Available
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 3: Customer Details -->
      <div v-if="step === 3" class="animate-fade-in-up">
        <h2 class="text-xl font-semibold text-dark-100 mb-1">Your Details</h2>
        <p class="text-dark-400 text-sm mb-5">Tell us who you are</p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Full Name *</label>
            <input v-model="customerName" type="text" class="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
            <input v-model="customerEmail" type="email" class="input-field" placeholder="john@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Phone *</label>
            <input v-model="customerPhone" type="tel" class="input-field" placeholder="(555) 000-0000" />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-1.5">Notes (optional)</label>
            <textarea v-model="customerNotes" class="input-field min-h-[80px] resize-none" placeholder="Any special requests..."></textarea>
          </div>
        </div>
      </div>

      <!-- STEP 4: Confirmation -->
      <div v-if="step === 4" class="animate-fade-in-up">
        <h2 class="text-xl font-semibold text-dark-100 mb-1">Review & Confirm</h2>
        <p class="text-dark-400 text-sm mb-5">Make sure everything looks good</p>

        <div class="card p-5 space-y-4">
          <div class="flex items-start gap-3">
            <MapPin :size="18" class="text-gold-400 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-xs text-dark-400 mb-0.5">Location</p>
              <p class="text-dark-100 font-medium text-sm">{{ store.currentLocation?.name }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Sparkles :size="18" class="text-gold-400 mt-0.5 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-xs text-dark-400 mb-1">Services</p>
              <div v-for="svc in selectedServices" :key="svc.id" class="flex justify-between text-sm mb-1">
                <span class="text-dark-100">{{ svc.name }}</span>
                <span class="text-dark-300">{{ formatPrice(svc.price) }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <UserCheck :size="18" class="text-gold-400 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-xs text-dark-400 mb-0.5">Stylist</p>
              <p class="text-dark-100 font-medium text-sm">{{ stylistLabel }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <CalendarDays :size="18" class="text-gold-400 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-xs text-dark-400 mb-0.5">Date & Time</p>
              <p class="text-dark-100 font-medium text-sm">{{ formatDateLong(selectedDate) }}</p>
              <p class="text-dark-300 text-sm">{{ formatTime(selectedTime) }} – {{ formatTime(selectedEndTime) }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <User :size="18" class="text-gold-400 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-xs text-dark-400 mb-0.5">Customer</p>
              <p class="text-dark-100 font-medium text-sm">{{ customerName }}</p>
              <p class="text-dark-300 text-sm">{{ customerPhone }}</p>
            </div>
          </div>

          <div class="border-t border-white/5 pt-3">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-dark-400">Total Duration</p>
                <p class="text-dark-200 font-medium">{{ totalDuration }} min</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-dark-400">Total Price</p>
                <p class="text-2xl font-bold text-gold-400">{{ formatPrice(totalPrice) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 z-30 glass px-5 py-3 border-t border-white/5">
      <div class="max-w-xl mx-auto flex items-center gap-3">
        <div class="flex-1 min-w-0" v-if="step < 4">
          <p class="text-xs text-dark-400">{{ serviceCountLabel }}</p>
          <p class="text-sm font-semibold text-gold-400">{{ formatPrice(totalPrice) }} · {{ totalDuration }} min</p>
        </div>

        <button v-if="step > 0" class="btn-secondary px-4" @click="step--">Back</button>

        <button
          v-if="step < 4"
          class="btn-primary px-6"
          :disabled="!canProceed"
          :class="{ 'opacity-50 cursor-not-allowed': !canProceed }"
          @click="step++"
        >
          Continue
        </button>

        <button v-if="step === 4" class="btn-primary px-8 flex-1" @click="confirmBooking">
          <Check :size="18" />
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store, formatPrice, formatTime, formatDate, formatDateLong, getServiceCategories, getStylistInitials } from '../store'
import {
  ArrowLeft, Clock, Check, Shuffle, ChevronLeft, ChevronRight,
  MapPin, Sparkles, UserCheck, User, CalendarDays, CalendarX, CheckCircle2
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const step = ref(0)
const selectedServiceIds = ref([])
const selectedStylistId = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const selectedEndTime = ref('')
const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const customerNotes = ref('')
const activeCategory = ref('All')

const calendarMonth = ref(new Date().getMonth())
const calendarYear = ref(new Date().getFullYear())

const stepLabels = ['Services', 'Stylist', 'Date', 'Details', 'Confirm']
const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

onMounted(() => {
  const svcId = route.query.service
  if (svcId) {
    const svc = store.locationServices.find(s => s.id === svcId)
    if (svc) selectedServiceIds.value.push(svcId)
  }
})

const categories = computed(() => ['All', ...getServiceCategories(store.locationServices)])

const filteredServices = computed(() => {
  if (activeCategory.value === 'All') return store.locationServices
  return store.locationServices.filter(s => s.category === activeCategory.value)
})

const selectedServices = computed(() =>
  store.services.filter(s => selectedServiceIds.value.includes(s.id))
)

const totalDuration = computed(() => selectedServices.value.reduce((sum, s) => sum + s.duration, 0))
const totalPrice = computed(() => selectedServices.value.reduce((sum, s) => sum + s.price, 0))

const serviceCountLabel = computed(() => {
  const count = selectedServices.value.length
  return count === 1 ? '1 service' : `${count} services`
})

const availableStylists = computed(() => {
  const serviceCategories = selectedServices.value.map(s => s.category)
  return store.locationStylists.filter(st =>
    serviceCategories.every(cat => st.skills.includes(cat))
  )
})

const actualStylistId = computed(() => {
  if (selectedStylistId.value === 'any') {
    return availableStylists.value.length > 0 ? availableStylists.value[0].id : null
  }
  return selectedStylistId.value
})

const stylistLabel = computed(() => {
  if (selectedStylistId.value === 'any') return 'Any Available'
  const s = store.stylists.find(st => st.id === selectedStylistId.value)
  return s ? s.name : ''
})

const timeSlots = computed(() => {
  if (!actualStylistId.value || !selectedDate.value) return []
  return store.getAvailableSlots(actualStylistId.value, selectedDate.value, totalDuration.value)
})

const canProceed = computed(() => {
  switch (step.value) {
    case 0: return selectedServiceIds.value.length > 0
    case 1: return selectedStylistId.value !== null
    case 2: return selectedDate.value && selectedTime.value
    case 3: return customerName.value.trim() && customerPhone.value.trim()
    default: return true
  }
})

const monthLabel = computed(() => {
  return new Date(calendarYear.value, calendarMonth.value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0)
  const startDow = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const todayStr = new Date().toISOString().slice(0, 10)

  const cells = []
  for (let i = 0; i < startDow; i++) cells.push({ day: null, dateStr: '', selectable: false, isToday: false })
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calendarYear.value}-${String(calendarMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isPast = dateStr < todayStr
    cells.push({ day: d, dateStr, selectable: !isPast, isToday: dateStr === todayStr })
  }
  return cells
})

function prevMonth () {
  if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- }
  else calendarMonth.value--
}
function nextMonth () {
  if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ }
  else calendarMonth.value++
}
function isServiceSelected (id) { return selectedServiceIds.value.includes(id) }
function toggleService (service) {
  const idx = selectedServiceIds.value.indexOf(service.id)
  if (idx > -1) selectedServiceIds.value.splice(idx, 1)
  else selectedServiceIds.value.push(service.id)
}
function handleBack () {
  if (step.value > 0) step.value--
  else router.back()
}
function confirmBooking () {
  const stylist = store.stylists.find(s => s.id === actualStylistId.value)
  const apt = store.addAppointment({
    customerName: customerName.value,
    customerId: null,
    locationId: store.currentLocationId,
    stylistId: actualStylistId.value,
    stylistName: stylist?.name || 'Any Available',
    services: selectedServices.value.map(s => ({ serviceId: s.id, name: s.name, duration: s.duration, price: s.price })),
    date: selectedDate.value,
    time: selectedTime.value,
    endTime: selectedEndTime.value,
    totalDuration: totalDuration.value,
    totalPrice: totalPrice.value,
    status: 'confirmed',
    paymentStatus: 'unpaid',
    notes: customerNotes.value,
  })
  router.push(`/booking/${apt.id}`)
}
</script>
