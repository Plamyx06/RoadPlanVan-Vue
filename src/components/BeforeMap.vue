<script setup>
import { ref } from "vue";
import CarSvg from '../components/Icon/CarIcon.vue';
import VanSvg from '../components/Icon/VanIcon.vue';
import CampingCarSvg from '../components/Icon/CampingCarIcon.vue';
import DatePicker from '../components/DatePicker.vue';
import { defineProps } from "vue";
import LocationCard from '../components/LocationCard.vue'
import MainButton from '../components/Button.vue'

const props = defineProps(['latitude', 'longitude', 'placeName','placeLocation','text']);
const selectedCar = ref(null);



function selectCar(car) {
  selectedCar.value = car;
}
</script>


<template>
<div class="container fixed mt-[264px] px-5 overflow-y-auto h-[400px]"  >
    <h1 class="text-2xl underline flex justify-center my-3">Avant de commencer</h1>
    <p>afin de te fournir une estimation de tes coûts de déplacement la plus précise possible, sélectionne ton véhicule : </p>
    <div class="flex justify-between ">
      <div><button  @click="selectCar('car')"
          :class="{ 'border-green-500': selectedCar === 'car' }" type="button"><component :is="CarSvg" class="w-14 h-14"/>6l/100km</button></div>
    <div><button type="button"><component :is="VanSvg" class="w-14 h-14"/>8l/100km</button></div>
    <div><button type="button"><component :is="CampingCarSvg" class="w-14 h-14" />10l/100km</button></div>
   </div>
    <p class="mt-3">si tu connais la consommation de ton vehicule entre la ici :
</p>
<div class="flex">
<input class="bg-white-200 rounded-full w-20 text-center drop-shadow-lg outline-none" type="text" id="diesel" name="diesel" 
       minlength="1" maxlength="2" >
       <p>/100km</p>
</div>
<h2 class="flex-grow underline my-3">Entre la ville de ton départ : </h2>
<div class="flex justify-end w-full my-3">
  <div id="geocoder" class="geocoder"></div>
</div>

<LocationCard :placeName="placeName" :placeLocation="placeLocation" />

<div v-if="placeLocation" class="w-full flex justify-between items-center my-5 ">
<div><h2 class="underline ">Date de départ: </h2></div>

<div class="flex-grow justify-between w-2/6 ">
<DatePicker class=""/>
</div>
</div>
<div v-if="placeLocation" class="text-center mb-20">
  <router-link to="/map">
<MainButton text="Je commence" />
  </router-link>
</div>
<div v-if="!placeLocation" class="mb-96"></div>
</div>

</template>

<style scoped>
.container
{font-family: 'Kalam', cursive;
background-color: #F8EDE0;
color: #8A4852;
};
body { margin: 0; padding: 0; }

</style>
