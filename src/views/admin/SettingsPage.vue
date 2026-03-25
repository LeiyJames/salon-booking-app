<template>
  <div class="p-4 md:p-6 max-w-4xl mx-auto">
    <h1 class="font-display text-2xl font-bold text-dark-100 mb-6">Settings</h1>
    <div class="space-y-6">
      <div class="card p-5">
        <h2 class="font-semibold text-dark-100 text-lg mb-4 flex items-center gap-2"><Shield :size="18" class="text-gold-400" /> Booking Policies</h2>
        <div class="space-y-4">
          <div><label class="block text-sm font-medium text-dark-300 mb-1.5">Cancellation Window</label>
            <select v-model="settings.cancelWindow" class="input-field"><option value="1">1 hour before</option><option value="2">2 hours before</option><option value="4">4 hours before</option><option value="24">24 hours before</option></select></div>
          <div><label class="block text-sm font-medium text-dark-300 mb-1.5">Max Advance Booking (days)</label>
            <input v-model.number="settings.maxAdvanceDays" type="number" class="input-field" min="1" max="365" /></div>
          <div class="flex items-center justify-between">
            <div><p class="text-dark-200 font-medium text-sm">Allow Guest Bookings</p><p class="text-xs text-dark-400">Customers can book without an account</p></div>
            <button class="w-12 h-7 rounded-full transition-colors relative" :class="settings.guestBooking ? 'bg-gold-500' : 'bg-dark-600'" @click="settings.guestBooking = !settings.guestBooking">
              <div class="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" :class="settings.guestBooking ? 'left-6' : 'left-1'"></div></button>
          </div>
        </div>
      </div>
      <div class="card p-5">
        <h2 class="font-semibold text-dark-100 text-lg mb-4 flex items-center gap-2"><Bell :size="18" class="text-gold-400" /> Reminders & Notifications</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div><p class="text-dark-200 font-medium text-sm">Booking Confirmation</p><p class="text-xs text-dark-400">Send confirmation after booking</p></div>
            <button class="w-12 h-7 rounded-full transition-colors relative" :class="settings.confirmNotification ? 'bg-gold-500' : 'bg-dark-600'" @click="settings.confirmNotification = !settings.confirmNotification">
              <div class="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" :class="settings.confirmNotification ? 'left-6' : 'left-1'"></div></button>
          </div>
          <div class="flex items-center justify-between">
            <div><p class="text-dark-200 font-medium text-sm">24h Reminder</p><p class="text-xs text-dark-400">Remind 24 hours before appointment</p></div>
            <button class="w-12 h-7 rounded-full transition-colors relative" :class="settings.reminder24h ? 'bg-gold-500' : 'bg-dark-600'" @click="settings.reminder24h = !settings.reminder24h">
              <div class="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" :class="settings.reminder24h ? 'left-6' : 'left-1'"></div></button>
          </div>
          <div class="flex items-center justify-between">
            <div><p class="text-dark-200 font-medium text-sm">2h Reminder</p><p class="text-xs text-dark-400">Remind 2 hours before appointment</p></div>
            <button class="w-12 h-7 rounded-full transition-colors relative" :class="settings.reminder2h ? 'bg-gold-500' : 'bg-dark-600'" @click="settings.reminder2h = !settings.reminder2h">
              <div class="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" :class="settings.reminder2h ? 'left-6' : 'left-1'"></div></button>
          </div>
        </div>
      </div>
      <div class="card p-5">
        <h2 class="font-semibold text-dark-100 text-lg mb-4 flex items-center gap-2"><CreditCard :size="18" class="text-gold-400" /> Payment Settings</h2>
        <div class="space-y-3">
          <div><label class="block text-sm font-medium text-dark-300 mb-1.5">Default Payment Mode</label>
            <select v-model="settings.paymentMode" class="input-field"><option value="in_person">Pay In Person (default)</option><option value="online">Online Payment</option><option value="both">Both Options</option></select></div>
          <div v-if="settings.paymentMode !== 'in_person'" class="bg-dark-700/50 rounded-xl p-4 text-sm text-dark-400">
            <p class="flex items-center gap-2 text-amber-400"><AlertTriangle :size="14" /> Online payment integration requires backend setup. This is a placeholder for MVP.</p></div>
        </div>
      </div>
      <button class="btn-primary w-full" @click="saveSettings">Save Settings</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { store } from '../../store'
import { Shield, Bell, CreditCard, AlertTriangle } from 'lucide-vue-next'

const settings = reactive({ cancelWindow: '24', maxAdvanceDays: 30, guestBooking: true, confirmNotification: true, reminder24h: true, reminder2h: true, paymentMode: 'in_person' })
function saveSettings () { localStorage.setItem('glowup_settings', JSON.stringify(settings)); store.showToast('Settings saved!', 'success') }
</script>
