<script setup>
import { onMounted, onUnmounted, ref, watch, defineProps } from 'vue';
import Spinner from './Spinner.vue';

const props = defineProps({
  city: String,
  country: String,
  countryCode: String,
});

const countryFlag = ref('');
const isLoading = ref(false)

const getCountryData = async (code) => {
  isLoading.value = true
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    countryFlag.value = data[0].flags.png;
  } catch (error) {
    console.error('Error:', error);
  }
  isLoading.value = false
};

onMounted(() => {
  getCountryData(props.countryCode);
});
onUnmounted(() => {
  countryFlag.value = '';
});

watch(() => props.countryCode, (newCode) => {
  getCountryData(newCode);
});
</script>



<template>
  <div
    class="bg-[#8A4852] bg-opacity-80 h-12 w-3/4 flex items-center rounded-full hover:bg-[#8A4852] drop-shadow-lg relative my-6 cursor-grab">
    <div>
      <Spinner v-if="isLoading" class="m-1 w-10 h-10 rounded-full" />
      <img v-if="!isLoading" :src="countryFlag" alt="Drapeau rond" class="m-1 w-10 h-10 rounded-full">
      <div class="absolute top-0 left-0 w-10 h-10 m-1 bg-black opacity-10 rounded-full"></div>

    </div>
    <div class="flex space-between w-3/4">
      <div>
        <p v-if="city" class="text-[#F8EDE0] text-sm mx-3 truncate capitalize">{{ city }}</p>
        <p v-if="country" class="text-[#F8EDE0] font-semibold text-sm mx-3 truncate">{{ country }}</p>
      </div>
      <div>
      </div>
    </div>

  </div>
</template>

<style scoped></style>