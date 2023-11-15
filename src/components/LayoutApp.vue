<script setup>
import { ref, defineEmits } from 'vue'
import Modal from '../components/DeleteModal.vue'
import RegisterModal from '../components/RegisterModal.vue'
import { useRouter } from 'vue-router'
import MenuUser from '../components/MenuUser.vue'

const emit = defineEmits(['select-button'])
const selectedButton = ref('itinerary')
const router = useRouter()

const handleButton = (button) => {
  selectedButton.value = button
  emit('select-button', button)
}

const handleCardButton = () => handleButton('card')
const handleItineraryButton = () => handleButton('itinerary')

const showModal = ref(false)
const showUserRegister = ref(false)
function handleCloseRegisterModal() {
  showUserRegister.value = false
}
function handleHomeButton() {
  handleButton('home')
  showModal.value = true
  showUserRegister.value = false
}
function handleReturnHome() {
  showModal.value = false
  router.push('/')
}
function handleCancel() {
  showModal.value = false
}
function handleSave() {
  showModal.value = false
  showUserRegister.value = true
}
function handleUserButton() {
  handleButton('user')
}
</script>

<template>
  <div v-show="selectedButton === 'card'" class="absolute mt-[45vh] left-0 overflow-hidden">
    <button style="background-color: #8a4852; color: #f8f4e8"
      class="justify-center rounded-r-full pl-3 pr-3 h-[5vh] text-sm font-semibold shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800"
      @click="handleItineraryButton" type="button">
      <div class="flex">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </div>
    </button>
  </div>

  <div v-show="selectedButton !== 'card'" class="nav_container fixed mt-[45vh] w-screen h-[5vh]">
    <div class="flex justify-between w-full h-full">
      <div :class="{ button_color_reverse: selectedButton === 'home' }" class="flex-1">
        <button @click="handleHomeButton" type="button" class="w-full h-full flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </button>
      </div>
      <div :class="{ button_color_reverse: selectedButton === 'card' }" class="flex-1">
        <button class="w-full h-full flex justify-center items-center" @click="handleCardButton" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </button>
      </div>
      <div :class="{ button_color_reverse: selectedButton === 'itinerary' }" class="flex-1">
        <button class="w-full h-full flex justify-center items-center" @click="handleItineraryButton" type="button">
          <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
        </button>
      </div>
      <div :class="{ button_color_reverse: selectedButton === 'user' }" class="flex-1">
        <MenuUser class="h-full w-full" v-on:user-button="handleUserButton" />
      </div>
    </div>
  </div>

  <Modal :show="showModal" :save="handleSave" :returnHome="handleReturnHome" :cancel="handleCancel" />
  <div class="fixed inset-x-0 bottom-0 flex justify-center">
    <RegisterModal v-show="showUserRegister" @close="handleCloseRegisterModal" />
  </div>
</template>

<style scoped>
.nav_container {
  background-color: #8a4852;
  color: #f8ede0;
}

.button_color_reverse {
  background-color: #f8ede0;
  color: #8a4852;
}
</style>
