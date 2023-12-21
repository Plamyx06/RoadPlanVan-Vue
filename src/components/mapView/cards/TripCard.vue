<script setup>
import RoadInformation from '@/components/mapView/RoadInformation.vue'
import TripCardMenu from '@/components/mapView/dropDownMenu/TripCardMenu.vue'
import { MapPinIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <ul
    role="list"
    class="bg-beige-custom border-2 border-red-custom rounded-lg drop-shadow-xl my-2 lg:my-3"
  >
    <li class="p-4">
      <div class="flex">
        <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg drop-shadow-xl">
          <img
            src="https://static-cse.canva.com/blob/996500/Sanstitre.jpg"
            class="h-full w-full object-cover object-center"
          />
        </div>
        <div class="ml-3 flex-1 text-sm">
          <div class="text-red-custom">
            <h5 class="font-medium">Voyage en Slovaquie</h5>
            <p class="mt-1 text-xs">24/01/2023</p>
            <p class="mt-1 flex items-center">
              <MapPinIcon class="w-5 h-5 mr-1" />
              2
            </p>
          </div>
        </div>
        <div class="flex justify-end">
          <TripCardMenu />
        </div>
      </div>
      <div class="mt-1 sm:flex sm:justify-between">
        <div class="flex items-center">
          <RoadInformation :duration="'0000'" :distance="'0000'" :price="'0000'" />
        </div>
      </div>
    </li>
  </ul>
</template>
