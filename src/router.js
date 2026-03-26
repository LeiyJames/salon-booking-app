import { createRouter, createWebHistory } from 'vue-router'
import { store } from './store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginPage.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomePage.vue'),
    meta: { role: 'customer' },
  },
  {
    path: '/book',
    name: 'Book',
    component: () => import('./views/BookingPage.vue'),
    meta: { role: 'customer' },
  },
  {
    path: '/booking/:id',
    name: 'BookingConfirmation',
    component: () => import('./views/BookingConfirmation.vue'),
    meta: { role: 'customer' },
  },
  {
    path: '/manage',
    name: 'ManageBooking',
    component: () => import('./views/ManageBooking.vue'),
    meta: { role: 'customer' },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('./views/admin/DashboardPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/calendar',
    name: 'AdminCalendar',
    component: () => import('./views/admin/CalendarPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/appointments',
    name: 'AdminAppointments',
    component: () => import('./views/admin/AppointmentsPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/clients',
    name: 'AdminClients',
    component: () => import('./views/admin/ClientsPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/inventory',
    name: 'AdminInventory',
    component: () => import('./views/admin/InventoryPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/services',
    name: 'AdminServices',
    component: () => import('./views/admin/ServicesPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/team',
    name: 'AdminTeam',
    component: () => import('./views/admin/TeamPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/locations',
    name: 'AdminLocations',
    component: () => import('./views/admin/LocationsPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('./views/admin/SettingsPage.vue'),
    meta: { role: 'admin' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior () {
    return { top: 0 }
  },
})

// ─── Navigation Guards ───
router.beforeEach((to, from, next) => {
  const isPublic = to.meta.public
  const requiredRole = to.meta.role

  // Allow public routes (login)
  if (isPublic) {
    // If already logged in, redirect to their home
    if (store.isLoggedIn) {
      return next(store.isAdmin ? '/admin' : '/')
    }
    return next()
  }

  // Not logged in → go to login
  if (!store.isLoggedIn) {
    return next('/login')
  }

  // Admin trying to access customer pages → redirect to admin
  if (requiredRole === 'customer' && store.isAdmin) {
    return next()  // Allow admins to see customer pages too
  }

  // Customer trying to access admin pages → redirect to home
  if (requiredRole === 'admin' && store.isCustomer) {
    store.showToast('Access denied. Admin only.', 'error')
    return next('/')
  }

  next()
})

export default router
