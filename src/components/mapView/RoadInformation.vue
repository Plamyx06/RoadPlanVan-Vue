<script setup>
import mapEmitter from '@/components/mapView/mapEvent.js'
import { defineProps, ref } from 'vue'
import Spinner from '@/components/mapView/Spinner.vue'
import { TruckIcon, ClockIcon } from '@heroicons/vue/20/solid'
import GasStationIcon from '@/components/mapView/icon/GasStationIcon.vue'

const { price, duration, distance } = defineProps(['duration', 'distance', 'price'])

const isLoading = ref(false)
mapEmitter.on('is-loading', updateLoadingStatus)
function updateLoadingStatus(value) {
  isLoading.value = value
}
</script>

<template>
  <div class="flex justify-end items-center my-1.5">
    <div class="flex items-center">
      <TruckIcon class="w-4 h-4 text-red-custom" />
      <Spinner v-if="isLoading" class="w-4 h-4" />
      <p v-else="!isLoading" class="ml-1 mr-2">{{ distance }}km</p>
    </div>

    <div class="flex items-center">
      <ClockIcon class="w-4 h-4 text-red-custom" />
      <Spinner v-if="isLoading" class="w-4 h-4" />
      <p v-else="!isLoading" class="ml-1 mr-2">{{ duration }}</p>
    </div>

    <div class="flex items-center">
      <GasStationIcon class="w-4 h-4" :color-svg="'#8A4852'" />
      <Spinner v-if="isLoading" class="w-4 h-4" />
      <p v-else="!isLoading" class="ml-1 mr-2">≈{{ price }}€</p>
    </div>
  </div>
</template>
