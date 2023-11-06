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
  selectedItem.value = null;
  selectedDate.value = new Date().toLocaleDateString('fr-FR');
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
  <div class="container fixed mt-[40vh] px-2  min-h-screen h-auto w-max-screen ">
    <h1 class="text-2xl underline flex justify-center my-2">Avant de commencer</h1>

    <div v-if="showContent">
      <transition name="fade">
        <div v-if="!confirmed">
          <p class="py-2 underline">Sélectionne ton véhicule : </p>
          <div class="flex justify-between">
            <div v-for="(item, index) in items" :key="index" class="relative px-6">
              <div @click="toggleSelect(index)">
                <component :is="item.svg" :class="item.class" />
                <div v-if="item.selected" class="absolute top-0 bottom-0 flex items-center justify-center ">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              {{ item.consumption }}L/100km
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
          <div class="flex justify-center my-5 mt-10">
            <MainButton text="Valider" @click="validateSelection" />
          </div>


        </div>


        <div v-else-if="confirmed" class=" flex justify-between items-center">
          <div>
            <p>Consommation {{ selectedItem }}L/100km</p>
            <p>départ le {{ selectedDate }}</p>
            <p v-if="enabled">Retour point départ</p>

          </div>
          <MainButton @click="modifyChoice" text="Modifier" />
        </div>
      </transition>
    </div>


    <transition name="slide-fade">
      <div :class="{ 'show': confirmed }" class="slide-fade">
        <h2 class="flex-grow underline my-3">Créer ton itinéraire </h2>
        <div class="w-7/12 mb-3">
          <div id="geocoder-origin-container" class=""></div>
        </div>
        <ErrorAlert v-if="noWaypoint" text="Aucun point de départ !" />
        <div class="text-center mb-20 mt-6">
          <MainButton text="Commencer" @click="hideMe" />
        </div>

      </div>

    </transition>

  </div>
</template>

<style scoped>
.container {
  font-family: 'Kalam', cursive;
  background-color: #F8EDE0;
  color: #8A4852;
}

;

body {
  margin: 0;
  padding: 0;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
  transform: translateY(20px);
}

.fade-enter {
  transition: opacity 1.5s, transform 1.5s;
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 1.5s, transform 1.5s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transition: opacity 1.5s, transform 1.5s;
  opacity: 0;
  transform: translateY(20px);
}

.container .slide-fade {
  transition: opacity 1.5s, transform 1.5s;
  opacity: 0;
  transform: translateY(20px);
}

.container .slide-fade.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
