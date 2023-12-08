<script setup>
import { defineProps, ref, watchEffect, computed, toRefs } from "vue";
import VanRadioGroup from "@/components/VanRadioGroup.vue";
import DatePicker from '@/components/DatePicker.vue';
import ToggleButton from '@/components/button/ToggleButton.vue';
import MainButton from '@/components/button/MainButton.vue';
import DividerWithMainButton from "@/components/button/DividerWithMainButton.vue";
import { ChevronLeftIcon } from '@heroicons/vue/20/solid';
import VueDraggable from 'vuedraggable';
import { PlusIcon, EllipsisVerticalIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import RoundedButton from '@/components/button/RoundedButton.vue';
import LocationCard from '@/components/cards/LocationCard.vue';
import Delete from '@/components/modal/Delete.vue';
import Road from '@/components/RoadInformation.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import emitter from "@/components/utility/mapEvent.js";

const ShowStarterOptionSection = ref(true)
const ShowDepartureSection = ref(false)
const ShowItinerarySection = ref(false)
const enabledReturnStart = ref(true);
const vehicleConsumption = ref(8)


//DatePicker
const selectedDate = ref(`${new Date().toLocaleDateString('fr-FR')}`);

function handleDateChange(newDate) {
    selectedDate.value = new Date(newDate);
}

//Section 1 (StarterOption)
function goToNextSection() {
    ShowStarterOptionSection.value = false
    ShowDepartureSection.value = true
    emitter.emit('enabled-return-start', enabledReturnStart.value);
    emitter.emit('consumption-value', vehicleConsumption.value);
}

//Section 2 (DepartureSection)
function goToStarterSection() {
    ShowStarterOptionSection.value = true
    ShowDepartureSection.value = false
}
function goToItinerarySection() {
    emitter.emit('updated-waypoint-origin');
}
emitter.on("no-waypoint-origin", () => showErrorAlert(noWaypointOrigin));
emitter.on("have-waypoint-origin", haveWaypointOrigin);

function haveWaypointOrigin() {
    ShowDepartureSection.value = false
    ShowItinerarySection.value = true
}
function UpdatedVehicleConsumption(consumption) {
    vehicleConsumption.value = consumption

}
function enableReturnStart(value) {
    enabledReturnStart.value = value;
}

const noWaypointOrigin = ref(false);
const ERROR_ALERT_TIMEOUT = 3000;

function showErrorAlert(errorAlertRef) {
    errorAlertRef.value = true;
    setTimeout(() => {
        errorAlertRef.value = false;
    }, ERROR_ALERT_TIMEOUT);
}

//SECTION 3
const props = defineProps(['waypoints']);
const mutableWaypoints = ref(props.waypoints);

const noWaypoint = ref(false);
const waypointExist = ref(false);
const isLoading = ref(false);
const showDeleteModal = ref(false);
const deleteLocation = ref({});



const PRICE_GASOLINE = 1.9;

// Emitter Event Handlers
emitter.on('no-waypoint', () => showErrorAlert(noWaypoint));
emitter.on('waypoint-exist', () => showErrorAlert(waypointExist));
emitter.on('enabled-return-start', (value) => enableReturnStart.value = value);
emitter.on('is-loading', (value) => isLoading.value = value);


// Event Handlers
function addNewWaypoint() {
    emitter.emit('add-point');
    mutableWaypoints.value = props.waypoints;

}
function openDeleteModal(element) {
    deleteLocation.value = element;
    showDeleteModal.value = true;
}
function handleCancel() {
    showDeleteModal.value = false;
}
function handleDelete() {
    const idToDelete = deleteLocation.value.id;
    const index = mutableWaypoints.value.findIndex(waypoint => waypoint.id === idToDelete);
    mutableWaypoints.value.splice(index, 1);
    emitter.emit('get-road-delete', mutableWaypoints.value);
    showDeleteModal.value = false;
}




function handleSave() {
    emitter.emit('open-save-modal')
}


// Draggable Handlers
const clonedWaypoints = ref([])

// enlever le .value de prop.waypoint ! 

function handleDraggableChange() {
    if (enabledReturnStart) {
        const check = checkStartEndEquality()
        if (check) {
            emitter.emit('get-road-draggable', mutableWaypoints.value);
        } else {
            mutableWaypoints.value = props.waypoints
            return
        }
    } else if (!enabledReturnStart) {
        const check = checkStartEquality()
        if (check) {
            emitter.emit('get-road-draggable', mutableWaypoints.value);
        } else {
            mutableWaypoints.value = props.waypoints
            return
        }
    }
}

function checkStartEquality() {
    console.log(props.waypoints)
    const isFirstSame = props.waypoints[0] === mutableWaypoints.value[0];
    return isFirstSame;
}

function checkStartEndEquality() {
    const isFirstSame = props.waypoints[0] === mutableWaypoints.value[0];
    const isLastSame = props.waypoints[props.waypoints.length - 1] === mutableWaypoints.value[mutableWaypoints.value.length - 1];
    return isFirstSame && isLastSame;
}


// Utility Functions
function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}h${formattedMinutes}`;
}



// Calculate Price Duration
const totalDuration = computed(() => calculateTotal(mutableWaypoints.value, 'duration'));
const totalDistance = computed(() => calculateTotal(mutableWaypoints.value, 'distance'));
const totalPrice = computed(() => calculatePrice(totalDistance.value, vehicleConsumption.value, PRICE_GASOLINE));


function calculateTotal(waypoints, key) {
    return waypoints.reduce((total, waypoint) => total + parseInt(waypoint[key] || 0), 0);
}

function calculatePrice(distance, consumption, priceGasoline) {
    return Math.ceil((distance / 100) * consumption * priceGasoline);
}


watchEffect(() => {
    mutableWaypoints.value = props.waypoints;
});


</script>



<template>
    <div
        class="fixed mt-[49vh] h-[51vh] w-screen overflow-y-auto bg-beige-custom text-red-custom px-5 lg:max-w-lg lg:w-4/12 lg:mt-[10vh]  lg:h-[85vh] lg:ml-5 lg:drop-shadow-lg lg:rounded-b-lg">
        <div class="sm:max-w-lg sm:mx-auto ">

            <section v-if="ShowStarterOptionSection">
                <div class="mt-4">
                    <h1 class="text-center text-xl font-bold underline">Avant de commencer</h1>
                </div>
                <VanRadioGroup @vehicle-consumption="UpdatedVehicleConsumption" class="mt-5" />

                <div class="my-6">
                    <h2 class="text-base font-semibold mb-4">Date de départ</h2>
                    <div class="mx-16 ">
                        <DatePicker :selectedDate="selectedDate" @date-changed="handleDateChange" />
                    </div>
                </div>
                <ToggleButton :label="'Activé le retour au point de départ ?'" @update-enabled="enableReturnStart" />
                <div class="flex justify-center mt-10 mb-32 lg:mt-16 ">
                    <MainButton @click="goToNextSection">Suivant</MainButton>
                </div>
            </section>

            <section :class="{ 'hidden': !ShowDepartureSection }">
                <div class="mt-4 flex">
                    <div class="-ml-4 flex-none">
                        <RoundedButton @click="goToStarterSection">
                            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                        </RoundedButton>
                    </div>
                    <div class="grow">
                        <h1 class="text-center text-xl font-bold underline">Créer ton itinéraire</h1>
                    </div>
                </div>
                <div class="w-full mt-6">
                    <div id="geocoder-origin-container" class=""></div>
                </div>
                <ErrorAlert v-if="noWaypointOrigin" text="Aucun point de départ !" />
                <div class="flex justify-center mt-10 mb-32 lg:mt-16 ">
                    <MainButton @click="goToItinerarySection">
                        Suivant</MainButton>
                </div>
            </section>

            <section :class="{ 'hidden': !ShowItinerarySection }">
                <div class="w-full mt-4">
                    <div id="geocoder" class="geocoder"></div>
                </div>
                <div>
                    <ErrorAlert v-if="noWaypoint" text="Aucune destination !" />
                    <ErrorAlert v-if="waypointExist" text="Cet destination a déjà été ajouté" />
                </div>
                <div class="text-center mt-2">
                    <DividerWithMainButton @click="addNewWaypoint">
                        <div class="flex justify-center items-center ">
                            <PlusIcon class="text-beige-custom h-5 w-5 pr-1" />
                            Ajouter
                        </div>
                    </DividerWithMainButton>
                </div>

                <div class="flex items-center mt-3">
                    <div class="w-5/6">
                        <VueDraggable v-model="mutableWaypoints" handle=".drag-handle" item-key="index"
                            @change="handleDraggableChange">
                            <template v-slot:item="{ element, index }">
                                <div>
                                    <div class="flex items-center h-12 ">
                                        <EllipsisVerticalIcon class="w-5 h-5" />

                                        <LocationCard
                                            v-if="index === 0 || (index === mutableWaypoints.length - 1 && enabledReturnStart)"
                                            :city="element.city" :country="element.country"
                                            :countryCode="element.countryCode" />

                                        <LocationCard v-else :city="element.city" :country="element.country"
                                            :countryCode="element.countryCode" :class="{ 'drag-handle': index > 0 }" />

                                        <RoundedButton
                                            v-if="!enabledReturnStart && index > 0 || (enabledReturnStart && index > 0 && index < (mutableWaypoints.length - 1))"
                                            @click="openDeleteModal(element)" :disabled="isLoading" class="ml-5">
                                            <XMarkIcon class="w-4 h-4" />
                                        </RoundedButton>


                                    </div>

                                    <template v-if="element.duration !== '' && index !== (mutableWaypoints.length - 1)">
                                        <Road :duration="formatDuration(element.duration)" :distance="element.distance"
                                            :price="Math.ceil((element.distance / 100) * vehicleConsumption * PRICE_GASOLINE)" />
                                    </template>

                                </div>
                            </template>
                        </VueDraggable>
                    </div>
                    <div class="w-1/6 flex items-center flex-col space-between h-full sm:ml-4 md:ml-12">
                        <template v-for="(waypoint, index ) in  mutableWaypoints ">
                            <div class="rounded-full bg-red-custom h-4 w-4 text-red-custom shadow-lg ring-[1px] ring-red-custom"
                                v-if="index === 0 || index === mutableWaypoints.length - 1">
                            </div>
                            <div class="rounded-full bg-beige-custom p-0.5 text-red-custom shadow-lg ring-[1px] ring-red-custom"
                                v-else>
                                <p class="w-3 h-3 flex items-center justify-center text-sm ">{{ index + 1 }}
                                </p>
                            </div>
                            <div v-if="index !== mutableWaypoints.length - 1"
                                class="border-l-2 border-dashed h-[56px] border-red-custom animate-opacity"
                                :style="`animation-delay: ${index * 0.5}s`"></div>
                        </template>
                    </div>
                </div>

                <div v-if="mutableWaypoints.length > 2">
                    <div class="border-b my-3 mx-5 border-red-custom"></div>
                    <div class="px-5 flex justify-between items-center max-w-screen ">
                        <p>Total :</p>
                        <Road :duration="formatDuration(totalDuration)" :distance="totalDistance" :price="totalPrice">
                        </Road>

                    </div>
                </div>
                <div v-if="mutableWaypoints.length > 2" class="mb-32 mt-6 text-center">
                    <MainButton @click="handleSave">
                        Sauvegarder</MainButton>
                </div>

                <Delete :show="showDeleteModal" :cancel="handleCancel" :deleted="handleDelete">
                    Veux-tu supprimer <span class="font-bold">{{ deleteLocation.city }}, {{ deleteLocation.country
                    }}</span> de ton RoadTrip ?
                </Delete>

            </section>

        </div>
    </div>
</template>

<style scoped>
@keyframes moveOpacity {

    0%,
    100% {
        opacity: 0.5;
    }

    50% {
        opacity: 1;
    }
}

.animate-opacity {
    animation: moveOpacity 3s ease-in-out infinite;
}
</style>