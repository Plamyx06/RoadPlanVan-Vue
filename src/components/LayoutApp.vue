<script setup>
import { ref, defineEmits } from 'vue'
import Modal from '../components/DeleteModal.vue';
import RegisterModal from '../components/UserRegister.vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['select-button'])
const selectedButton = ref('itinerary')
const router = useRouter();

const handleButton = (button) => {
  selectedButton.value = button;
  emit('select-button', button);
};



const handleCardButton = () => handleButton('card');
const handleItineraryButton = () => handleButton('itinerary');
const handleUserButton = () => handleButton('user');

const showModal = ref(false)
const showUserRegister = ref(false)
function handleHomeButton() {
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



</script>


<template>
  <div class="nav_container absolute bottom-0 w-screen h-[8vh] overflow-y-hidden">
    <div class="flex justify-between w-full h-full">
      <button :class="{ 'button_color_reverse': selectedButton === 'home' }"
        class="flex-1 h-18 w-1/4 flex items-center justify-center" @click="handleHomeButton" type="button">
        <img class="w-14 h-14" src="../assets/logo.svg" alt="Logo" />
      </button>
      <button :class="{ 'button_color_reverse': selectedButton === 'card' }"
        class="flex-1 h-18 w-1/4 flex items-center justify-center" @click="handleCardButton" type="button">
        <div class="flex flex-col items-center">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          <span>Carte</span>
        </div>
      </button>
      <button :class="{ 'button_color_reverse': selectedButton === 'itinerary' }"
        class="flex-1 h-18 w-1/4 flex items-center justify-center" @click="handleItineraryButton" type="button">
        <div class="flex flex-col items-center">
          <div>
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

            <span>Itinéraire</span>
          </div>
        </div>
      </button>
      <button :class="{ 'button_color_reverse': selectedButton === 'user' }"
        class="flex-1 h-18 w-1/4 flex items-center justify-center" @click="handleUserButton" type="button">
        <div class="flex flex-col items-center">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Compte</span>
        </div>
      </button>
    </div>
  </div>
  <Modal :show="showModal" :save="handleSave" :returnHome="handleReturnHome" :cancel="handleCancel" />
  <div class="fixed inset-x-0 bottom-0 flex justify-center">
    <RegisterModal v-show="showUserRegister" />
  </div>
</template>  

<style scoped>
.nav_container {
  background-color: #8A4852;
  color: #F8EDE0;
  z-index: 1;
}

.button_color_reverse {
  background-color: #F8EDE0;
  color: #8A4852
}
</style>