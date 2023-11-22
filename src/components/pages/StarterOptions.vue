<script setup>
// Imports and Component Definitions
import { ref, markRaw } from "vue";
import { ChevronLeftIcon } from '@heroicons/vue/20/solid';
import Car from '@/components/icon/Car.vue';
import Van from '@/components/icon/Van.vue';
import CampingCar from '@/components/icon/CampingCar.vue';
import DatePicker from '@/components/DatePicker.vue';
import MainButton from '@/components/button/MainButton.vue';
import ToggleButton from '@/components/button/ToggleButton.vue';
import RoundedButton from '@/components/button/RoundedButton.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import emitter from "@/components/utility/eventBus";

const items = ref([
  { svg: markRaw(Car), consumption: '6', selected: false },
  { svg: markRaw(Van), consumption: '8', selected: true },
  { svg: markRaw(CampingCar), consumption: '10', selected: false },
]);
const showContent = ref(true);
const confirmed = ref(false);
const selectedItem = ref();
const selectedDate = ref(`${new Date().toLocaleDateString('fr-FR')}`);
const hide = ref(false);
const noWaypoint = ref(false);
const enabledReturnStart = ref(true);

const emits = defineEmits(['hide']);

// Emitter Event Handlers
emitter.on("no-waypoint-origin", () => errorAlert(noWaypoint, false));
emitter.on("have-waypoint-origin", () => emits('hide'));

// Functions Event Handlers
function selectConsumption(index) {
  items.value = items.value.map((item, idx) => ({ ...item, selected: idx === index }));
}

function validateSelection() {
  confirmed.value = true;
  selectedItem.value = items.value.find(item => item.selected).consumption;
  emitter.emit('enabled-return-start', enabledReturnStart.value);
  emitter.emit('consumption-value', selectedItem.value);
}

function modifyChoice() {
  confirmed.value = false;
}

function handleDateChange(newDate) {
  selectedDate.value = new Date(newDate);
}

function hideMe() {
  emitter.emit('updated-waypoint-origin');
}

function enableReturnStart(newValue) {
  enabledReturnStart.value = newValue;
}

function errorAlert(errorAlert, hideValue) {
  errorAlert.value = true;
  hide.value = hideValue;
  setTimeout(() => {
    errorAlert.value = false;
  }, 3000);
}




</script>



<template>
  <div
    class="fixed mt-[49vh] h-[51vh] w-screen overflow-y-auto bg-beige-custom text-red-custom px-5 lg:max-w-lg lg:w-4/12 lg:mt-[10vh]  lg:h-[85vh] lg:ml-5 lg:drop-shadow-lg lg:rounded-b-lg">
    <div class="sm:max-w-lg sm:mx-auto ">
      <div v-if="showContent">
        <div class="flex justify-between items-center w-full pt-2 mt-3 lg:mt-1">
          <div v-if="confirmed" class="ml-[-12px]">
            <RoundedButton @click="modifyChoice">
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </RoundedButton>
          </div>
          <h1 class="text-xl underline flex-1 text-center">Avant de commencer</h1>
        </div>

        <div v-if="!confirmed">
          <p class="py-2 underline">Sélectionne ton véhicule : </p>
          <div class="grid gap-2 grid-cols-2 w-full sm:gap-3 sm:grid-cols-3">
            <div v-for="(item, index) in items" :key="index" class="w-full">

              <div @click="selectConsumption(index)" class="relative flex justify-center">
                <component :is="item.svg" :class="'w-14 h-14 block mx-auto'" />

                <div v-if="item.selected" class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="text-center">{{ item.consumption }}L/100km</div>
            </div>
          </div>
          <div class="my-6 w-full">
            <h2 class="underline">Date de départ: </h2>
            <div class="flex justify-end w-full ">
              <DatePicker :selectedDate="selectedDate" @date-changed="handleDateChange" />
            </div>
          </div>
          <div>
            <ToggleButton :label="'Activé le retour au point de départ ?'" @update-enabled="enableReturnStart" />
          </div>
          <div class="flex justify-center my-5 mb-36">
            <MainButton text="Suivant" @click="validateSelection" />
          </div>
        </div>
      </div>
      <div :class="{ 'hidden': !confirmed }">
        <h2 class="flex-grow underline my-3">Créer ton itinéraire </h2>
        <div class="w-7/12 mb-3">
          <div id="geocoder-origin-container" class=""></div>
        </div>
        <ErrorAlert v-if="noWaypoint" text="Aucun point de départ !" />
        <div class="text-center mt-6">
          <MainButton text="Commencer" @click="hideMe" />
        </div>
      </div>
    </div>
  </div>
</template>
