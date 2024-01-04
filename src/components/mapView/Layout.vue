<script setup>
import { ref } from 'vue'
import { UserCircleIcon } from '@heroicons/vue/24/outline'
import BackHomeModal from '@/components/mapView/modal/BackHomeModal.vue'
import RegisterModal from '@/components/mapView/modal/RegisterModal.vue'
import Logo from '@/components/Logo.vue'

const showBackHomeModal = ref(false)
const showRegisterModal = ref(false)

function handleHomeButton() {
  showBackHomeModal.value = true
}
function handleCancelBackHome() {
  showBackHomeModal.value = false
}

function handleCloseRegisterModal() {
  showRegisterModal.value = false
}
function handleUserButton() {
  showRegisterModal.value = true
}
</script>

<template>
  <div class="absolute z-20 bg-white max-h-[20px] h-full w-full blur-2xl"></div>
  <div class="w-full absolute z-20 flex justify-between items-center px-3 py-1">
    <button
      type="button"
      @click="handleHomeButton"
      class="flex justify-center w-full rounded-full max-w-[200px] max-h-[200px] sm:max-w-[250px] sm:max-h-[250px]"
    >
      <Logo class="w-full" />
    </button>

    <div>
      <button class="shadow-sm" @click="handleUserButton">
        <UserCircleIcon class="h-8 w-8 text-red-custom rounded-full lg:h-10 lg:w-10" />
      </button>
    </div>

    <div class="fixed inset-x-0 bottom-0 flex justify-center">
      <RegisterModal v-show="showRegisterModal" @close="handleCloseRegisterModal" />
    </div>
  </div>
  <BackHomeModal :show="showBackHomeModal" :cancel="handleCancelBackHome" />
</template>
