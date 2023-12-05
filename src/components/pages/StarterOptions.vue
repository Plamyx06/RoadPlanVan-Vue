<script setup>
// Imports and Component Definitions
import { ref } from "vue";
import { ChevronLeftIcon } from '@heroicons/vue/20/solid';
import DatePicker from '@/components/DatePicker.vue';
import MainButton from '@/components/button/MainButton.vue';
import ToggleButton from '@/components/button/ToggleButton.vue';
import RoundedButton from '@/components/button/RoundedButton.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import emitter from "@/components/utility/eventBus";
import VanRadioGroup from "@/components/VanRadioGroup.vue";


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
          <VanRadioGroup class="mt-5" />
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
