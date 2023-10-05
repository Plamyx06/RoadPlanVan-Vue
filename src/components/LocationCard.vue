<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  placeName: String,
  placeLocation: String,
});
</script>


<template>
<div class="bg-[#8A4852] bg-opacity-80 h-12 w-3/4 flex items-center rounded-full hover:bg-[#8A4852] drop-shadow-lg relative my-6">
  <div>
    <img src="https://www.countryflags.com/wp-content/uploads/france-flag-png-large.png" alt="Drapeau rond" class="m-1 h-10 w-10 rounded-full relative">
    <div class="absolute top-0 left-0 w-10 h-10 m-1 bg-black opacity-10 rounded-full"></div> 
  </div>
  <div class="w-3/4">
    <p class="text-[#F8EDE0] text-sm mx-3 truncate capitalize">{{placeName}}</p>
    <p class="text-[#F8EDE0] font-semibold text-sm mx-3 truncate">{{placeLocation}}</p>
  </div>
</div>
</template>

<style scoped>
</style>