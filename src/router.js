import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomePage.vue'),
  },
  {
    path: '/book',
    name: 'Book',
    component: () => import('./views/BookingPage.vue'),
  },
  {
    path: '/booking/:id',
    name: 'BookingConfirmation',
    component: () => import('./views/BookingConfirmation.vue'),
  },
  {
    path: '/manage',
    name: 'ManageBooking',
    component: () => import('./views/ManageBooking.vue'),
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('./views/admin/DashboardPage.vue'),
  },
  {
    path: '/admin/calendar',
    name: 'AdminCalendar',
    component: () => import('./views/admin/CalendarPage.vue'),
  },
  {
    path: '/admin/appointments',
    name: 'AdminAppointments',
    component: () => import('./views/admin/AppointmentsPage.vue'),
  },
  {
    path: '/admin/clients',
    name: 'AdminClients',
    component: () => import('./views/admin/ClientsPage.vue'),
  },
  {
    path: '/admin/services',
    name: 'AdminServices',
    component: () => import('./views/admin/ServicesPage.vue'),
  },
  {
    path: '/admin/team',
    name: 'AdminTeam',
    component: () => import('./views/admin/TeamPage.vue'),
  },
  {
    path: '/admin/locations',
    name: 'AdminLocations',
    component: () => import('./views/admin/LocationsPage.vue'),
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('./views/admin/SettingsPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior () {
    return { top: 0 }
  },
})

export default router
