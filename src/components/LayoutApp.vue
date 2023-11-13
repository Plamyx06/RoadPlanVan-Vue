<script setup>
import { ref, defineEmits, } from 'vue'
import Modal from '../components/DeleteModal.vue';
import RegisterModal from '../components/UserRegister.vue';
import { useRouter } from 'vue-router';
import MenuUser from '../components/MenuUser.vue'

const emit = defineEmits(['select-button'])
const selectedButton = ref('itinerary')
const router = useRouter();

const handleButton = (button) => {
  selectedButton.value = button;
  emit('select-button', button);
};



const handleCardButton = () => handleButton('card');
const handleItineraryButton = () => handleButton('itinerary');



const showModal = ref(false)
const showUserRegister = ref(false)
function handleHomeButton() {
  handleButton('home');
  showModal.value = true;
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
  handleButton('user');
}



</script>


<template>
  <div :class="selectedButton === 'card' ? 'mt-[95vh]' : 'mt-[45vh]'" class="nav_container fixed w-screen h-[5vh] ">
    <div class="flex justify-between w-full h-full">
      <div :class="{ 'button_color_reverse': selectedButton === 'home' }"
        class="flex-1 h-18 w-1/4 flex items-center justify-center">
        <button @click="handleHomeButton" type="button">
          <img class="w-14 h-14" src="../assets/logo.svg" alt="Logo" />
        </button>
      </div>
      <div :class="{ 'button_color_reverse': selectedButton === 'card' }"
        class="flex-1 h-18 w-1/4 flex items-center justify-center">
        <button class="flex-1 h-18 w-1/4 flex items-center justify-center" @click="handleCardButton" type="button">


          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>

        </button>
      </div>
      <div :class="{ 'button_color_reverse': selectedButton === 'itinerary' }"
        class="flex-1 h-18 w-1/4 flex items-center justify-center">
        <button class="flex-1 h-18 w-1/4 flex items-center justify-center" @click="handleItineraryButton" type="button">

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
      <div :class="{ 'button_color_reverse': selectedButton === 'user' }"
        class="flex-1 h-18 w-1/4 flex items-center justify-center">
        <MenuUser v-on:user-button="handleUserButton" />
      </div>
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

}

.button_color_reverse {
  background-color: #F8EDE0;
  color: #8A4852
}
</style>