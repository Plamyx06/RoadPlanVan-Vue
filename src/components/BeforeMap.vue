<script setup>
import { ref, markRaw } from "vue";
import CarSvg from '../components/Icon/CarIcon.vue';
import VanSvg from '../components/Icon/VanIcon.vue';
import CampingCarSvg from '../components/Icon/CampingCarIcon.vue';
import DatePicker from '../components/DatePicker.vue';
import MainButton from '../components/Button.vue'
import ToggleSelect from '../components/ToggleLoop.vue'
import emitter from "./utility/eventBus";
import ErrorAlert from '../components/ErrorAlert.vue'

const items = ref([
  {
    svg: markRaw(CarSvg),
    class: 'w-14 h-14 ',
    consumption: '6',
    selected: false,
  },
  {
    svg: markRaw(VanSvg),
    class: 'w-14 h-14',
    consumption: '8',
    selected: true,
  },
  {
    svg: markRaw(CampingCarSvg),
    class: 'w-14 h-14',
    consumption: '10',
    selected: false,
  },
]);
const showContent = ref(true);
const confirmed = ref(false);
const selectedItem = ref();
const selectedDate = ref(`${new Date().toLocaleDateString('fr-FR')}`);

const toggleSelect = (index) => {
  items.value = items.value.map((item, idx) => {
    return { ...item, selected: idx === index };
  });
};


const validateSelection = () => {
  confirmed.value = true;
  selectedItem.value = items.value.find(item => item.selected);
  selectedItem.value = selectedItem.value.consumption
  console.log(selectedItem.value)
  emitter.emit('enabled-loop', enabled.value);
  emitter.emit('consumption-value', selectedItem.value);
};

const modifyChoice = () => {
  confirmed.value = false;
};



const handleDateChange = (newDate) => {
  selectedDate.value = new Date(newDate).toLocaleDateString('fr-FR');
  console.log(`Selected date in BeforeMap: ${selectedDate.value}`);
}


const emits = defineEmits(['hide']);


const hideMe = () => {
  emitter.emit('updated-waypoint-origin')
  if (!hide.value) {
    emits('hide');
  } else {
    return
  }
}
const hide = ref(false)

const noWaypoint = ref(false)
emitter.on("no-waypoint-origin", () => {
  noWaypoint.value = true;
  hide.value = true
  setTimeout(() => {
    noWaypoint.value = false;

  }, 3000);
  setTimeout(() => {
    hide.value = false
  }, 1000);
});


const enabled = ref(true);
function handleEnable(newValue) {
  enabled.value = newValue

}




</script>


<template>
  <div class="container fixed mt-[50vh] h-[50vh] overflow-y-auto px-2">



    <div v-if="showContent">
      <h1 class="text-xl underline flex justify-center ">Avant de commencer</h1>
      <div v-if="!confirmed">
        <p class="py-2 underline">Sélectionne ton véhicule : </p>
        <!-- Grid centré -->
        <div class="grid gap-2 grid-cols-2 w-full">
          <div v-for="(item, index) in items" :key="index" class="w-full">
            <!-- Conteneur avec position relative pour le positionnement absolu des enfants -->
            <div @click="toggleSelect(index)" class="relative flex justify-center">
              <component :is="item.svg" :class="[item.class, 'block mx-auto']" />
              <!-- Positionnement absolu centré si l'élément est sélectionné -->
              <div v-if="item.selected" class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div class="text-center">{{ item.consumption }}L/100km</div> <!-- Texte centré sous l'icône -->
          </div>
        </div>
        <div class="my-6">
          <h2 class="underline">Date de départ: </h2>
          <div class="flex justify-end">
            <DatePicker @date-changed="handleDateChange" />
          </div>
        </div>
        <div>
          <ToggleSelect @update-enabled="handleEnable" />
        </div>
        <div class="flex justify-center my-5 ">
          <MainButton text="Suivant" @click="validateSelection" />
        </div>
      </div>


      <div v-else-if="confirmed" class="flex justify-between items-center">
        <!--
        <MainButton @click="modifyChoice" text="<" />-->
      </div>

    </div>




    <div :class="{ 'hidden': !confirmed }" class="...">
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
</template>

<style scoped>
.container {
  font-family: 'Kalam', cursive;
  background-color: #F8EDE0;
  color: #8A4852;
}
</style>
