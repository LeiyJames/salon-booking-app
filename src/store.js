import { reactive } from 'vue'

/* ─────────────────────────────────────
 * MOCK DATA STORE
 * All data is held in-memory + localStorage
 * ───────────────────────────────────── */

// ─── Helpers ───
const genId = () => Math.random().toString(36).slice(2, 10)
const today = () => new Date().toISOString().slice(0, 10)

// ─── Locations ───
const locations = [
  {
    id: 'loc-1',
    name: 'GlowUp Studio — Downtown',
    address: '123 Main Street, Metro City',
    phone: '(555) 100-2000',
    hours: '9:00 AM – 8:00 PM',
    image: null,
    coordinates: { lat: 14.5995, lng: 120.9842 },
  },
  {
    id: 'loc-2',
    name: 'GlowUp Studio — Eastside',
    address: '456 Oak Avenue, East Village',
    phone: '(555) 200-3000',
    hours: '10:00 AM – 7:00 PM',
    image: null,
    coordinates: { lat: 14.5547, lng: 121.0244 },
  },
]

// ─── Services ───
const services = [
  { id: 'svc-1', name: 'Classic Haircut', duration: 30, price: 350, category: 'Haircut', locationIds: ['loc-1', 'loc-2'] },
  { id: 'svc-2', name: 'Fade & Taper', duration: 45, price: 450, category: 'Haircut', locationIds: ['loc-1', 'loc-2'] },
  { id: 'svc-3', name: 'Beard Trim & Shape', duration: 20, price: 200, category: 'Grooming', locationIds: ['loc-1', 'loc-2'] },
  { id: 'svc-4', name: 'Hot Towel Shave', duration: 30, price: 400, category: 'Grooming', locationIds: ['loc-1'] },
  { id: 'svc-5', name: 'Hair Color', duration: 90, price: 1200, category: 'Color', locationIds: ['loc-1', 'loc-2'] },
  { id: 'svc-6', name: 'Highlights', duration: 120, price: 1800, category: 'Color', locationIds: ['loc-1'] },
  { id: 'svc-7', name: 'Keratin Treatment', duration: 120, price: 2500, category: 'Treatment', locationIds: ['loc-1', 'loc-2'] },
  { id: 'svc-8', name: 'Scalp Treatment', duration: 45, price: 600, category: 'Treatment', locationIds: ['loc-1', 'loc-2'] },
  { id: 'svc-9', name: 'Kids Haircut', duration: 20, price: 250, category: 'Haircut', locationIds: ['loc-1', 'loc-2'] },
  { id: 'svc-10', name: 'Shampoo & Blowdry', duration: 30, price: 300, category: 'Styling', locationIds: ['loc-1', 'loc-2'] },
]

// ─── Stylists ───
const stylists = [
  {
    id: 'stf-1', name: 'Marco Rivera', role: 'Senior Stylist', avatar: null,
    skills: ['Haircut', 'Grooming', 'Color'], locationIds: ['loc-1'],
    availability: {
      mon: { start: '09:00', end: '17:00' },
      tue: { start: '09:00', end: '17:00' },
      wed: { start: '09:00', end: '17:00' },
      thu: { start: '09:00', end: '17:00' },
      fri: { start: '09:00', end: '17:00' },
      sat: { start: '10:00', end: '15:00' },
      sun: null,
    },
  },
  {
    id: 'stf-2', name: 'Aisha Santos', role: 'Creative Director', avatar: null,
    skills: ['Haircut', 'Color', 'Treatment', 'Styling'], locationIds: ['loc-1'],
    availability: {
      mon: { start: '10:00', end: '18:00' },
      tue: { start: '10:00', end: '18:00' },
      wed: null,
      thu: { start: '10:00', end: '18:00' },
      fri: { start: '10:00', end: '18:00' },
      sat: { start: '10:00', end: '16:00' },
      sun: null,
    },
  },
  {
    id: 'stf-3', name: 'Jake Torres', role: 'Barber', avatar: null,
    skills: ['Haircut', 'Grooming'], locationIds: ['loc-1', 'loc-2'],
    availability: {
      mon: { start: '09:00', end: '17:00' },
      tue: { start: '09:00', end: '17:00' },
      wed: { start: '09:00', end: '17:00' },
      thu: { start: '09:00', end: '17:00' },
      fri: { start: '09:00', end: '17:00' },
      sat: null,
      sun: null,
    },
  },
  {
    id: 'stf-4', name: 'Lena Cruz', role: 'Colorist', avatar: null,
    skills: ['Color', 'Treatment', 'Styling'], locationIds: ['loc-2'],
    availability: {
      mon: { start: '10:00', end: '18:00' },
      tue: { start: '10:00', end: '18:00' },
      wed: { start: '10:00', end: '18:00' },
      thu: null,
      fri: { start: '10:00', end: '18:00' },
      sat: { start: '09:00', end: '14:00' },
      sun: null,
    },
  },
]

// ─── Customers ───
const defaultCustomers = [
  { id: 'cust-1', name: 'John Doe', email: 'john@example.com', phone: '(555) 111-0001', notes: 'Prefers short fade' },
  { id: 'cust-2', name: 'Maria Garcia', email: 'maria@example.com', phone: '(555) 111-0002', notes: '' },
  { id: 'cust-3', name: 'David Chen', email: 'david@example.com', phone: '(555) 111-0003', notes: 'Allergic to certain products' },
]

// ─── Appointments ───
function generateSampleAppointments () {
  const d = new Date()
  const todayStr = today()
  const tomorrowStr = new Date(d.getTime() + 86400000).toISOString().slice(0, 10)
  const dayAfterStr = new Date(d.getTime() + 2 * 86400000).toISOString().slice(0, 10)

  return [
    {
      id: 'apt-1', customerId: 'cust-1', customerName: 'John Doe',
      locationId: 'loc-1', stylistId: 'stf-1', stylistName: 'Marco Rivera',
      services: [{ serviceId: 'svc-2', name: 'Fade & Taper', duration: 45, price: 450 }],
      date: todayStr, time: '10:00', endTime: '10:45',
      totalDuration: 45, totalPrice: 450,
      status: 'confirmed', paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(), notes: '',
    },
    {
      id: 'apt-2', customerId: 'cust-2', customerName: 'Maria Garcia',
      locationId: 'loc-1', stylistId: 'stf-2', stylistName: 'Aisha Santos',
      services: [
        { serviceId: 'svc-5', name: 'Hair Color', duration: 90, price: 1200 },
        { serviceId: 'svc-10', name: 'Shampoo & Blowdry', duration: 30, price: 300 },
      ],
      date: todayStr, time: '14:00', endTime: '16:00',
      totalDuration: 120, totalPrice: 1500,
      status: 'confirmed', paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(), notes: 'First time color',
    },
    {
      id: 'apt-3', customerId: 'cust-3', customerName: 'David Chen',
      locationId: 'loc-2', stylistId: 'stf-3', stylistName: 'Jake Torres',
      services: [{ serviceId: 'svc-1', name: 'Classic Haircut', duration: 30, price: 350 }],
      date: tomorrowStr, time: '11:00', endTime: '11:30',
      totalDuration: 30, totalPrice: 350,
      status: 'confirmed', paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(), notes: '',
    },
    {
      id: 'apt-4', customerId: 'cust-1', customerName: 'John Doe',
      locationId: 'loc-1', stylistId: 'stf-1', stylistName: 'Marco Rivera',
      services: [{ serviceId: 'svc-3', name: 'Beard Trim & Shape', duration: 20, price: 200 }],
      date: dayAfterStr, time: '09:00', endTime: '09:20',
      totalDuration: 20, totalPrice: 200,
      status: 'pending', paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(), notes: '',
    },
  ]
}

// ─── Persist helpers ───
function loadFromStorage (key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function saveToStorage (key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

// ─── Reactive Store ───
export const store = reactive({
  // Data
  locations,
  services,
  stylists,
  customers: loadFromStorage('glowup_customers', defaultCustomers),
  appointments: loadFromStorage('glowup_appointments', generateSampleAppointments()),
  notifications: loadFromStorage('glowup_notifications', []),

  // UI state
  currentLocationId: 'loc-1',
  currentUser: { id: 'admin-1', name: 'Admin', role: 'super_admin' },
  toasts: [],

  // ─── Getters ───
  get currentLocation () {
    return this.locations.find(l => l.id === this.currentLocationId)
  },

  get locationServices () {
    return this.services.filter(s => s.locationIds.includes(this.currentLocationId))
  },

  get locationStylists () {
    return this.stylists.filter(s => s.locationIds.includes(this.currentLocationId))
  },

  get todayAppointments () {
    const t = today()
    return this.appointments
      .filter(a => a.date === t && a.locationId === this.currentLocationId && a.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time))
  },

  get upcomingAppointments () {
    const t = today()
    return this.appointments
      .filter(a => a.date >= t && a.status !== 'cancelled')
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  },

  // ─── Actions ───
  addAppointment (apt) {
    const newApt = { ...apt, id: 'apt-' + genId(), createdAt: new Date().toISOString() }
    this.appointments.push(newApt)
    this._persist()
    this.showToast('Appointment booked successfully!', 'success')
    return newApt
  },

  updateAppointment (id, updates) {
    const idx = this.appointments.findIndex(a => a.id === id)
    if (idx > -1) {
      Object.assign(this.appointments[idx], updates)
      this._persist()
    }
  },

  cancelAppointment (id) {
    this.updateAppointment(id, { status: 'cancelled' })
    this.showToast('Appointment cancelled', 'warning')
  },

  rescheduleAppointment (id, newDate, newTime, newEndTime) {
    this.updateAppointment(id, { date: newDate, time: newTime, endTime: newEndTime, status: 'confirmed' })
    this.showToast('Appointment rescheduled', 'success')
  },

  markPayment (id, status) {
    this.updateAppointment(id, { paymentStatus: status })
    this.showToast(`Payment marked as ${status}`, 'success')
  },

  addCustomer (customer) {
    const newCust = { ...customer, id: 'cust-' + genId() }
    this.customers.push(newCust)
    saveToStorage('glowup_customers', this.customers)
    this.showToast('Customer added', 'success')
    return newCust
  },

  addService (service) {
    const newSvc = { ...service, id: 'svc-' + genId() }
    this.services.push(newSvc)
    return newSvc
  },

  updateService (id, updates) {
    const idx = this.services.findIndex(s => s.id === id)
    if (idx > -1) Object.assign(this.services[idx], updates)
  },

  deleteService (id) {
    const idx = this.services.findIndex(s => s.id === id)
    if (idx > -1) this.services.splice(idx, 1)
  },

  // ─── Availability / Slot generation ───
  getAvailableSlots (stylistId, date, totalDuration) {
    const stylist = this.stylists.find(s => s.id === stylistId)
    if (!stylist) return []

    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const dayOfWeek = dayNames[new Date(date + 'T00:00:00').getDay()]
    const schedule = stylist.availability[dayOfWeek]
    if (!schedule) return []

    const startMinutes = timeToMinutes(schedule.start)
    const endMinutes = timeToMinutes(schedule.end)

    // Get existing appointments for this stylist on this date
    const booked = this.appointments.filter(
      a => a.stylistId === stylistId && a.date === date && a.status !== 'cancelled'
    )

    const slots = []
    for (let m = startMinutes; m + totalDuration <= endMinutes; m += 15) {
      const slotStart = minutesToTime(m)
      const slotEnd = minutesToTime(m + totalDuration)

      const conflict = booked.some(a => {
        const aStart = timeToMinutes(a.time)
        const aEnd = timeToMinutes(a.endTime)
        return m < aEnd && m + totalDuration > aStart
      })

      if (!conflict) {
        slots.push({ time: slotStart, endTime: slotEnd })
      }
    }

    return slots
  },

  // ─── Toast ───
  showToast (message, type = 'info') {
    const id = genId()
    this.toasts.push({ id, message, type })
    setTimeout(() => {
      const idx = this.toasts.findIndex(t => t.id === id)
      if (idx > -1) this.toasts.splice(idx, 1)
    }, 3500)
  },

  _persist () {
    saveToStorage('glowup_appointments', this.appointments)
    saveToStorage('glowup_customers', this.customers)
  },
})

// ─── Utility functions ───
export function timeToMinutes (timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime (minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatTime (timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export function formatDate (dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatDateLong (dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatPrice (price) {
  return '₱' + price.toLocaleString()
}

export function getServiceCategories (servicesList) {
  return [...new Set(servicesList.map(s => s.category))]
}

export function getStylistInitials (name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
