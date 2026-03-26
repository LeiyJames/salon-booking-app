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
const defaultCustomers = []

// ─── Appointments ───
function generateSampleAppointments () {
  return []
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
  inventory: loadFromStorage('glowup_inventory', [
    { id: 'inv-1', name: 'Premium Hair Wax', category: 'Styling', quantity: 24, price: 450, minStock: 5 },
    { id: 'inv-2', name: 'Moisturizing Shampoo', category: 'Hair Care', quantity: 15, price: 650, minStock: 10 },
    { id: 'inv-3', name: 'Argan Oil Serum', category: 'Treatment', quantity: 8, price: 850, minStock: 5 },
    { id: 'inv-4', name: 'Matte Clay', category: 'Styling', quantity: 12, price: 400, minStock: 5 },
    { id: 'inv-5', name: 'Scalp Scrub', category: 'Hair Care', quantity: 4, price: 550, minStock: 8 },
  ]),
  notifications: loadFromStorage('glowup_notifications', []),

  // UI state
  currentLocationId: 'loc-1',
  currentUser: loadFromStorage('glowup_auth', null),
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

  get todayRevenue () {
    const t = today()
    return this.appointments
      .filter(a => a.date === t && a.paymentStatus === 'paid' && a.status !== 'cancelled')
      .reduce((sum, a) => sum + a.totalPrice, 0)
  },

  get weeklyRevenue () {
    const now = new Date()
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().slice(0, 10)
    return this.appointments
      .filter(a => a.date >= firstDay && a.paymentStatus === 'paid' && a.status !== 'cancelled')
      .reduce((sum, a) => sum + a.totalPrice, 0)
  },

  get monthlyRevenue () {
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
    return this.appointments
      .filter(a => a.date >= firstDay && a.paymentStatus === 'paid' && a.status !== 'cancelled')
      .reduce((sum, a) => sum + a.totalPrice, 0)
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

  // ─── Inventory Actions ───
  addInventoryItem (item) {
    const newItem = { ...item, id: 'inv-' + genId() }
    this.inventory.push(newItem)
    this._persist()
    this.showToast('Item added to inventory', 'success')
    return newItem
  },

  updateInventoryItem (id, updates) {
    const idx = this.inventory.findIndex(i => i.id === id)
    if (idx > -1) {
      Object.assign(this.inventory[idx], updates)
      this._persist()
      this.showToast('Inventory updated', 'success')
    }
  },

  deleteInventoryItem (id) {
    const idx = this.inventory.findIndex(i => i.id === id)
    if (idx > -1) {
      this.inventory.splice(idx, 1)
      this._persist()
      this.showToast('Item removed from inventory', 'warning')
    }
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
    for (let m = startMinutes; m + totalDuration <= endMinutes; m += 30) { // Set to 30 min intervals for better UI readability
      const slotStart = minutesToTime(m)
      const slotEnd = minutesToTime(m + totalDuration)

      const conflictingAppt = booked.find(a => {
        const aStart = timeToMinutes(a.time)
        const aEnd = timeToMinutes(a.endTime)
        return m < aEnd && m + totalDuration > aStart
      })

      let status = 'available'
      if (conflictingAppt) {
        if (conflictingAppt.status === 'confirmed' && conflictingAppt.paymentStatus === 'paid') {
          status = 'booked'
        } else {
          status = 'pending' // Someone is booking/waiting for payment
        }
      }

      slots.push({ time: slotStart, endTime: slotEnd, status })
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

  // ─── Auth ───
  login (role) {
    const user = role === 'admin'
      ? { id: 'admin-1', name: 'Admin', role: 'super_admin' }
      : { id: 'user-1', name: 'Customer', role: 'customer' }
    this.currentUser = user
    saveToStorage('glowup_auth', user)
  },

  logout () {
    this.currentUser = null
    localStorage.removeItem('glowup_auth')
  },

  get isLoggedIn () {
    return !!this.currentUser
  },

  get isAdmin () {
    return this.currentUser?.role === 'super_admin'
  },

  get isCustomer () {
    return this.currentUser?.role === 'customer'
  },

  _persist () {
    saveToStorage('glowup_appointments', this.appointments)
    saveToStorage('glowup_customers', this.customers)
    saveToStorage('glowup_inventory', this.inventory)
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
