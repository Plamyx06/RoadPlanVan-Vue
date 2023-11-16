<script setup>
import RoadInformation from './RoadInformation.vue';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
import menuTripCard from './MenuTripCard.vue'
</script>

<template>
    <h4 class="sr-only">Items</h4>
    <ul role="list" class="divide-y divide-gray-200 bg-redCustom border-2 border-redCustom rounded-lg drop-shadow-xl">
        <li class="p-4">

            <div class="flex ">

                <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 drop-shadow-xl">
                    <img src="https://static-cse.canva.com/blob/996500/Sanstitre.jpg"
                        class="h-full w-full object-cover object-center" />
                </div>
                <div class="ml-6 flex-1 text-sm">

                    <div class="font-medium text-beigeCustom">
                        <h5>Voyage en Slovaquie</h5>
                        <p class="mt-1">24/01/2023</p>
                        <p class="mt-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>2</p>
                    </div>

                </div>
                <div class=" flex justify-end">
                    <menuTripCard />
                </div>
            </div>

            <div class="mt-6 sm:flex sm:justify-between">
                <div class="flex items-center text-beigeCustom">
                    <RoadInformation :duration="'0000'" :distance="'0000'" :price="'0000'" />
                </div>
            </div>
        </li>
    </ul>
</template>
  
