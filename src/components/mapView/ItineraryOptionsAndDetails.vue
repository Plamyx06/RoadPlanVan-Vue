<script setup>
import { ref, computed, onMounted } from 'vue'
import VanRadioGroup from '@/components/mapView/VanRadioGroup.vue'
import ToggleButton from '@/components/button/ToggleButton.vue'
import MainButton from '@/components/button/MainButton.vue'
import DividerWithMainButton from '@/components/button/DividerWithMainButton.vue'
import { ChevronLeftIcon } from '@heroicons/vue/20/solid'
import ContinueItinerayModal from '@/components/mapView/modal/ContinueItineraryModal.vue'
import VueDraggable from 'vuedraggable'
import {
    PlusIcon,
    EllipsisVerticalIcon,
    XMarkIcon,
    MapPinIcon,
    ArrowTrendingUpIcon,
    Cog8ToothIcon
} from '@heroicons/vue/24/outline'
import RoundedButton from '@/components/button/RoundedButton.vue'
import LocationCard from '@/components/mapView/cards/LocationCard.vue'
import DeleteModal from '@/components/mapView/modal/DeleteModal.vue'
import RoadInformation from '@/components/mapView/RoadInformation.vue'
import ErrorAlert from '@/components/mapView/ErrorAlert.vue'
import mapEmitter from '@/components/mapView/mapEvent.js'
import RegisterModal from '@/components/mapView/modal/RegisterModal.vue'


const clonedWaypoints = ref(JSON.parse(localStorage.getItem('itinerary-waypoints')) || [])
const showComponent = ref(true)
const showStarterOptionSection = ref(true)
const showDepartureSection = ref(false)
const showItinerarySection = ref(false)
const showContinueItinerayModal = ref(false)
const showRegisterModal = ref(false)
const returnToStartingWaypoint = ref(true)
const vehicleConsumption = ref(10)
const noWaypointOrigin = ref(false)
const noWaypoint = ref(false)
const waypointExist = ref(false)
const noRoadwaypoint = ref(false)
const isLoading = ref(false)
const showDeleteModal = ref(false)
const deleteLocation = ref({})
const tripName = ref('')

// Constante
const PRICE_GASOLINE = 1.9
const ERROR_ALERT_TIMEOUT = 3000
const LIMIT_WAYPOINTS = 11

// Emitter Event Handlers
mapEmitter.on('no-waypoint-origin', () => showErrorAlert(noWaypointOrigin))
mapEmitter.on('have-waypoint-origin', haveWaypointOrigin)
mapEmitter.on('no-waypoint', () => showErrorAlert(noWaypoint))
mapEmitter.on('waypoint-exist', () => showErrorAlert(waypointExist))
mapEmitter.on('no-road-for-waypoints', () => showErrorAlert(noRoadwaypoint))
mapEmitter.on('is-loading', (value) => (isLoading.value = value))
mapEmitter.on('updated-waypoints-storage', updatedClonedWaypoints)


onMounted(() => {
    const storedWaypoints = JSON.parse(localStorage.getItem('itinerary-waypoints'))
    if (storedWaypoints !== null) {
        showStarterOptionSection.value = false
        clonedWaypoints.value = [...storedWaypoints]
        showItinerarySection.value = true
    }
})

// Header
function handleCloseComponent() {
    showComponent.value = false
    mapEmitter.emit('resize-map')
}
function handleOpenComponent() {
    showComponent.value = true
    mapEmitter.emit('resize-map')
}

//Section 1 (StarterOption)
function goToNextSection() {
    if (clonedWaypoints.value.length === 0) {
        showStarterOptionSection.value = false
        showDepartureSection.value = true
        mapEmitter.emit('return-to-starting-waypoint', returnToStartingWaypoint.value)
    } else {
        showContinueItinerayModal.value = true
    }
    const itineraryOptions = {
        tripName: tripName.value,
        returnToStartingWaypoint: returnToStartingWaypoint.value,
        vehicleConsumption: vehicleConsumption.value
    }
    console.log('itineraryOptions', itineraryOptions)

    localStorage.setItem('itinerary-options', JSON.stringify(itineraryOptions))
    mapEmitter.emit('return-to-starting-waypoint', returnToStartingWaypoint.value)
}

function handleContinueRoadTrip() {
    const startPointLonLat = [clonedWaypoints.value[0].lon, clonedWaypoints.value[0].lat]
    const endPointLonLat = [
        clonedWaypoints.value[clonedWaypoints.value.length - 1].lon,
        clonedWaypoints.value[clonedWaypoints.value.length - 1].lat
    ]
    const isSameWaypoints =
        startPointLonLat[0] === endPointLonLat[0] && startPointLonLat[1] === endPointLonLat[1]

    if (isSameWaypoints) {
        if (!returnToStartingWaypoint.value) {
            mapEmitter.emit('delete-end-waypoints')
        } else if (returnToStartingWaypoint.value && clonedWaypoints.value.length === 1) {
            mapEmitter.emit('add-end-waypoints')
        }
    } else if (!isSameWaypoints) {
        if (returnToStartingWaypoint.value) {
            mapEmitter.emit('add-end-waypoints')
        }
    }

    showContinueItinerayModal.value = false
    showStarterOptionSection.value = false
    showItinerarySection.value = true
}
function handleResetRoadTrip() {
    mapEmitter.emit('reset-roadtrip')
    clonedWaypoints.value = []
    showContinueItinerayModal.value = false
    showStarterOptionSection.value = false
    showDepartureSection.value = true
}

//Section 2 (DepartureSection)
function goToStarterSection() {
    showStarterOptionSection.value = true
    showDepartureSection.value = false
    showItinerarySection.value = false
}

function goToItinerarySection() {
    mapEmitter.emit('add-waypoint-origin')
}

function updatedClonedWaypoints() {
    const storedWaypoints = JSON.parse(localStorage.getItem('itinerary-waypoints'))
    clonedWaypoints.value = [...storedWaypoints]
}
function haveWaypointOrigin() {
    showDepartureSection.value = false
    showItinerarySection.value = true
}

function UpdatedVehicleConsumption(consumption) {
    vehicleConsumption.value = consumption
}

function enableReturnStart(value) {
    returnToStartingWaypoint.value = value
}

function showErrorAlert(errorAlertRef) {
    errorAlertRef.value = true
    setTimeout(() => {
        errorAlertRef.value = false
    }, ERROR_ALERT_TIMEOUT)
}

//SECTION 3
function handleCloseRegisterModal() {
    showRegisterModal.value = false
}

function addNewWaypoint() {
    if (clonedWaypoints.value.length === LIMIT_WAYPOINTS) {
        showRegisterModal.value = true
    } else {
        mapEmitter.emit('add-point')
    }
}

function openDeleteModal(element) {
    deleteLocation.value = element
    showDeleteModal.value = true
}

function handleCancel() {
    showDeleteModal.value = false
}

function handleDelete() {
    const idToDelete = deleteLocation.value.id;
    const newWaypoints = clonedWaypoints.value.filter((waypoint) => waypoint.id !== idToDelete);
    clonedWaypoints.value = [...newWaypoints];
    mapEmitter.emit('get-road-delete', clonedWaypoints.value);
    showDeleteModal.value = false;
}


// Draggable Handlers
function handleDraggableChange() {
    const waypointsEquality = returnToStartingWaypoint.value
        ? checkStartEndWaypointEquality()
        : checkStartWaypointEquality()
    if (waypointsEquality) {
        mapEmitter.emit('get-road-draggable', clonedWaypoints.value)
    } else {
        clonedWaypoints.value = JSON.parse(localStorage.getItem('itinerary-waypoints'))
    }
}

function checkStartWaypointEquality() {
    const waypointsCopy = JSON.parse(localStorage.getItem('itinerary-waypoints'))
    const isStartPointSame = waypointsCopy[0].id === clonedWaypoints.value[0].id
    return isStartPointSame
}

function checkStartEndWaypointEquality() {
    const waypointsCopy = JSON.parse(localStorage.getItem('itinerary-waypoints'))
    const idStartPoint = clonedWaypoints.value[0].id
    const idEndPoint = clonedWaypoints.value[clonedWaypoints.value.length - 1].id

    const isStartPointSame = waypointsCopy[0].id === idStartPoint
    const isEndPointSame = waypointsCopy[waypointsCopy.length - 1].id === idEndPoint

    return isStartPointSame && isEndPointSame
}

function handleSortWaypoints() {
    mapEmitter.emit('sort-waypoints')
}

// Calculate Price Duration
const totalDuration = computed(() => calculateTotal(clonedWaypoints.value, 'duration'))
const totalDistance = computed(() => calculateTotal(clonedWaypoints.value, 'distance'))
const totalPrice = computed(() =>
    calculatePrice(totalDistance.value, vehicleConsumption.value, PRICE_GASOLINE)
)

function calculateTotal(waypoints, key) {
    return waypoints.reduce((total, waypoint) => total + parseInt(waypoint[key] || 0), 0)
}

function calculatePrice(distance, consumption, priceGasoline) {
    return Math.ceil((distance / 100) * consumption * priceGasoline)
}

function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600)
    const minutes = Math.floor((durationInSeconds % 3600) / 60)
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${hours}h${formattedMinutes}`
}
</script>

<template>
    <div v-if="!showComponent">
        <div class="absolute z-10 mt-[45vh] left-0 overflow-hidden lg:mt-[5vh] lg:w-4/12">
            <button
                class="justify-center bg-red-custom text-beige-custom rounded-r-full pl-3 pr-3 h-[5vh] text-sm font-semibold shadow-sm hover:bg-red-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-custom"
                @click="handleOpenComponent" type="button">
                <div class="flex">
                    <MapPinIcon class="w-6 h-6" />
                    <ArrowTrendingUpIcon class="w-5 h-5" />
                    <MapPinIcon class="w-4 h-4" />
                </div>
            </button>
        </div>
    </div>
    <div :class="{ hidden: !showComponent }">
        <div
            class="fixed mt-[45vh] h-[5vh] w-full bg-red-custom text-beige-custom px-1 lg:max-w-lg lg:w-4/12 lg:mt-[6vh] lg:h-[5vh] lg:ml-5 lg:drop-shadow-lg lg:rounded-t-lg">
            <div class="flex items-center justify-between h-full overflow-hidden">
                <div v-if="showDepartureSection">
                    <RoundedButton @click="goToStarterSection">
                        <ChevronLeftIcon class="h-8 w-8" aria-hidden="true" />
                    </RoundedButton>
                </div>
                <div v-if="showItinerarySection">
                    <RoundedButton @click="goToStarterSection">
                        <Cog8ToothIcon class="h-8 w-8" aria-hidden="true" />
                    </RoundedButton>
                </div>
                <div v-if="showStarterOptionSection" class="h-8 w-8"></div>
                <div class="w-3/4">
                    <h1 v-if="showStarterOptionSection"
                        class="text-center text-xl font-bold flex justify-center w-full truncate">
                        Options du road trip
                    </h1>
                    <h1 v-else-if="showDepartureSection" class="text-center text-xl font-bold truncate">
                        Créer ton itinéraire
                    </h1>
                    <h1 v-else="showItinerarySection" class="text-center text-xl font-bold truncate">
                        {{ tripName || 'Roadtrip' }}
                    </h1>
                </div>
                <div>
                    <RoundedButton @click="handleCloseComponent">
                        <XMarkIcon class="h-8 w-8" aria-hidden="true" />
                    </RoundedButton>
                </div>
            </div>
        </div>
        <div v
            class="absolute z-10 mt-[50vh] h-[50vh] w-screen overflow-y-auto bg-beige-custom text-red-custom px-5 lg:max-w-lg lg:w-4/12 lg:mt-[11vh] lg:h-[85vh] lg:ml-5 lg:drop-shadow-lg lg:rounded-b-lg">
            <div class="sm:max-w-lg sm:mx-auto">
                <section v-if="showStarterOptionSection">
                    <VanRadioGroup @vehicle-consumption="UpdatedVehicleConsumption" class="mt-5" />

                    <div class="my-6">
                        <label for="tripName" class="text-red-custom text-base font-semibold">Nom du voyage</label>
                        <div class="mt-4 mx-6">
                            <input id="tripName" v-model="tripName" @input="saveToLocalStorage"
                                class="block w-full rounded-md py-3 text-red-custom shadow-sm border-none placeholder:text-gray-400 focus:outline-none focus:border-red-custom focus:ring-2 focus:ring-red-custom"
                                placeholder="Nom, ex : Voyage en Slovenie" maxlength="40" />
                        </div>
                    </div>
                    <ToggleButton :label="'Retourner au point de départ'" @update-enabled="enableReturnStart" />
                    <div class="flex justify-center mt-10 mb-32 lg:mt-16">
                        <MainButton @click="goToNextSection">Suivant</MainButton>
                    </div>
                </section>
                <ContinueItinerayModal :show="showContinueItinerayModal" :continued="handleContinueRoadTrip"
                    :reset="handleResetRoadTrip">
                    Souhaites-tu reprendre le road trip que tu as commencé ?
                </ContinueItinerayModal>

                <section :class="{ hidden: !showDepartureSection }">
                    <div class="w-full mt-6">
                        <div id="geocoder-origin-container" class=""></div>
                    </div>
                    <ErrorAlert v-if="noWaypointOrigin" text="Aucun point de départ !" />
                    <div class="flex justify-center mt-10 mb-32 lg:mt-16">
                        <MainButton @click="goToItinerarySection"> Suivant</MainButton>
                    </div>
                </section>

                <section :class="{ hidden: !showItinerarySection }">
                    <div class="w-full mt-4">
                        <div id="geocoder" class="geocoder"></div>
                    </div>
                    <div>
                        <ErrorAlert v-if="noWaypoint" text="Aucune destination n'a été ajoutée !" />
                        <ErrorAlert v-if="waypointExist" text="Cette destination a déjà été ajoutée" />
                        <ErrorAlert v-if="noRoadwaypoint" text="Oups... Aucun itinéraire n'a été trouvé pour ce lieu" />
                    </div>
                    <div class="text-center mt-2">
                        <DividerWithMainButton @click="addNewWaypoint" :disabled="isLoading">
                            <div class="flex justify-center items-center">
                                <PlusIcon class="text-beige-custom h-5 w-5 pr-1" />
                                Ajouter
                            </div>
                        </DividerWithMainButton>
                    </div>

                    <div class="flex items-center mt-3">
                        <div class="w-5/6">
                            <VueDraggable v-model="clonedWaypoints" handle=".drag-handle" item-key="index"
                                @change="handleDraggableChange">
                                <template v-slot:item="{ element, index }">
                                    <div>
                                        <div class="flex items-center h-12">
                                            <EllipsisVerticalIcon v-if="(!returnToStartingWaypoint && index > 0) ||
                                                (returnToStartingWaypoint &&
                                                    index > 0 &&
                                                    index < clonedWaypoints.length - 1)
                                                " class="w-5 h-5 ml-[-20px]" />

                                            <LocationCard v-if="index === 0 ||
                                                (index === clonedWaypoints.length - 1 && returnToStartingWaypoint)
                                                " :city="element.city" :country="element.country"
                                                :countryCode="element.countryCode" />

                                            <LocationCard v-else :city="element.city" :country="element.country"
                                                :countryCode="element.countryCode" :class="{ 'drag-handle': index > 0 }" />

                                            <RoundedButton v-if="(!returnToStartingWaypoint && index > 0) ||
                                                (returnToStartingWaypoint &&
                                                    index > 0 &&
                                                    index < clonedWaypoints.length - 1)
                                                " @click="openDeleteModal(element)" :disabled="isLoading" class="ml-5">
                                                <XMarkIcon class="w-4 h-4" />
                                            </RoundedButton>
                                        </div>

                                        <template v-if="element.duration !== '' && index !== clonedWaypoints.length - 1">
                                            <RoadInformation :class="'text-xs'" :duration="formatDuration(element.duration)"
                                                :distance="element.distance" :price="Math.ceil((element.distance / 100) * vehicleConsumption * PRICE_GASOLINE)
                                                    " />
                                        </template>
                                    </div>
                                </template>
                            </VueDraggable>
                        </div>
                        <div class="w-1/6 flex items-center flex-col space-between h-full sm:ml-4 md:ml-12">
                            <template v-for="(waypoint, index) in clonedWaypoints">
                                <div class="rounded-full bg-red-custom h-4 w-4 text-red-custom shadow-lg ring-[1px] ring-red-custom"
                                    v-if="index === 0 || index === clonedWaypoints.length - 1"></div>
                                <div class="rounded-full bg-beige-custom p-0.5 text-red-custom shadow-lg ring-[1px] ring-red-custom"
                                    v-else>
                                    <p class="h-3 flex items-center justify-center text-sm">{{ index + 1 }}</p>
                                </div>
                                <div v-if="index !== clonedWaypoints.length - 1"
                                    class="border-l-2 border-dashed h-[60px] border-red-custom animate-opacity"
                                    :style="`animation-delay: ${index * 0.5}s`"></div>
                            </template>
                        </div>
                    </div>

                    <div v-if="clonedWaypoints.length > 2">
                        <div class="relative mt-3">
                            <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                <div class="w-full border-t border-red-custom" />
                            </div>
                            <div class="relative flex justify-center">
                                <span class="bg-beige-custom rounded-full px-3 font-semibold text-red-custom">Total</span>
                            </div>
                        </div>
                        <div class="flex justify-center">
                            <RoadInformation :class="'text-sm'" :duration="formatDuration(totalDuration)"
                                :distance="totalDistance" :price="totalPrice">
                            </RoadInformation>
                        </div>
                    </div>
                    <div class="mb-32 mt-6 flex px-3 justify-center">
                        <MainButton v-if="clonedWaypoints.length > 2 && returnToStartingWaypoint"
                            @click="handleSortWaypoints">
                            Réorganiser
                        </MainButton>
                    </div>

                    <DeleteModal :show="showDeleteModal" :cancel="handleCancel" :deleted="handleDelete">
                        Veux-tu vraiment supprimer
                        <span class="font-bold">{{ deleteLocation.city }}, {{ deleteLocation.country }}</span>
                        de ton Road trip ?
                    </DeleteModal>
                    <RegisterModal v-show="showRegisterModal" @close="handleCloseRegisterModal" />
                </section>
            </div>
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
