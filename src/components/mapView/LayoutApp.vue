<script setup>
import { ref, defineEmits } from 'vue'
import BackHomeModal from '@/components/mapView/modal/BackHomeModal.vue'
import RegisterModal from '@/components/mapView/modal/RegisterModal.vue'
import UserMenu from '@/components/mapView/dropDownMenu/UserMenu.vue'
import NavbarButton from '@/components/button/NavbarButton.vue'
import {
  MapPinIcon,
  ArrowTrendingUpIcon,
  HomeIcon,
  MapIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import mapEmitter from '@/components/mapView/mapEvent.js'

const emit = defineEmits(['select-button'], 'cancel')
const selectedButton = ref('itinerary')
const showBackHomeModal = ref(false)
const showRegisterModal = ref(false)

mapEmitter.on('open-save-modal', handleSave)

function handleButton(button) {
  selectedButton.value = button
}

function handleMapButton() {
  handleButton('map')
  emit('select-button', selectedButton.value)
}
function handleItineraryButton() {
  handleButton('itinerary')
  emit('select-button', selectedButton.value)
}

function handleCloseRegisterModal() {
  showRegisterModal.value = false
  selectedButton.value = 'itinerary'
}
function handleHomeButton() {
  handleButton('home')
  showBackHomeModal.value = true
  showRegisterModal.value = false
}
function handleCancel() {
  showBackHomeModal.value = false
  selectedButton.value = 'itinerary'
}
function handleSave() {
  showBackHomeModal.value = false
  showRegisterModal.value = true
}
function handleUserButton() {
  handleButton('user')
}
</script>

<template>
  <div
    v-show="selectedButton === 'map'"
    class="absolute mt-[45vh] left-0 overflow-hidden lg:mt-[5vh] lg:w-4/12"
  >
    <button
      class="justify-center bg-red-custom text-beige-custom rounded-r-full pl-3 pr-3 h-[5vh] text-sm font-semibold shadow-sm hover:bg-red-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-custom"
      @click="handleItineraryButton"
      type="button"
    >
      <div class="flex">
        <MapPinIcon class="w-6 h-6" />
        <ArrowTrendingUpIcon class="w-5 h-5" />
        <MapPinIcon class="w-4 h-4" />
      </div>
    </button>
  </div>

  <div
    v-show="selectedButton !== 'map'"
    class="bg-red-custom text-beige-custom fixed mt-[45vh] w-screen h-[5vh] lg:mt-[5vh] lg:ml-5 lg:rounded-t-lg lg:w-4/12 lg:max-w-lg"
  >
    <div class="grid gap-4 grid-cols-4 w-full h-full">
      <NavbarButton
        :class="{ 'bg-beige-custom text-red-custom': selectedButton === 'home' }"
        @click="handleHomeButton"
      >
        <HomeIcon class="w-6 h-6" />
      </NavbarButton>

      <NavbarButton
        @click="handleMapButton"
        :class="{ 'bg-beige-custom text-red-custom': selectedButton === 'card' }"
        type="button"
      >
        <MapIcon class="w-6 h-6" />
      </NavbarButton>

      <NavbarButton
        :class="{ 'bg-beige-custom text-red-custom': selectedButton === 'itinerary' }"
        @click="handleItineraryButton"
      >
        <MapPinIcon class="w-6 h-6" />
        <ArrowTrendingUpIcon class="w-5 h-5" />
        <MapPinIcon class="w-4 h-4" />
      </NavbarButton>

      <div
        :class="{ 'bg-beige-custom text-red-custom': selectedButton === 'user' }"
        class="flex justify-center w-full h-full lg:rounded-tr-lg"
      >
        <UserMenu v-on:user-button="handleUserButton" class="w-full h-full">
          <div class="flex justify-center items-center w-full h-full">
            <UserIcon class="w-6 h-6" />
          </div>
        </UserMenu>
      </div>
    </div>
  </div>

  <BackHomeModal :show="showBackHomeModal" :save="handleSave" :cancel="handleCancel" />
  <div class="fixed inset-x-0 bottom-0 flex justify-center">
    <RegisterModal v-show="showRegisterModal" @close="handleCloseRegisterModal" />
  </div>
</template>
