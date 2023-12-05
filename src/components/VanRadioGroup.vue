<template>
    <RadioGroup v-model="selectedVehicle">
        <RadioGroupLabel class="text-base font-semibold leading-6 text-red-custom">Selectionne ton vehicule
        </RadioGroupLabel>

        <div class="mt-4 grid grid-cols-2 sm:max-w-xl gap-y-3 gap-x-3 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-2">
            <RadioGroupOption as="template" v-for="(vehicle, index) in vehicles" :key="index" :value="vehicle"
                v-slot="{ active, checked }">
                <div
                    :class="[active ? 'border-red-custom ring-2 ring-red-custom' : 'border-red-custom', 'relative flex justify-center pl-6 cursor-pointer rounded-lg border bg-beige-custom p-2 shadow-md focus:outline-none']">
                    <span class="flex" :class="{ 'mt-3': index === 0, 'mt-1.5': index === 2 }">
                        <span class="flex flex-col">
                            <RadioGroupLabel as="span" class="block text-sm font-medium">
                                <component :is="vehicle.svg"></component>
                            </RadioGroupLabel>
                            <RadioGroupDescription as="span" class=" flex items-center text-sm text-red-custom"
                                :class="{ 'mt-1.5': index === 1 }">{{
                                    vehicle.consumption }}L/100km</RadioGroupDescription>

                        </span>
                    </span>
                    <CheckCircleIcon :class="[!checked ? 'invisible' : '', 'h-5 w-5 text-red-custom']" aria-hidden="true" />
                    <span
                        :class="[active ? 'border' : 'border-2', checked ? 'border-red-custom' : 'border-transparent', 'pointer-events-none absolute -inset-px rounded-lg']"
                        aria-hidden="true" />
                </div>
            </RadioGroupOption>
        </div>
    </RadioGroup>
</template>
  
<script setup>
import { ref, markRaw } from 'vue'
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
import Car from '@/components/icon/CarIcon.vue';
import Van from '@/components/icon/VanIcon.vue';
import CampingCar from '@/components/icon/CampingCarIcon.vue';

const vehicles = [
    { svg: markRaw(Car), consumption: 8 },
    { svg: markRaw(Van), consumption: 10 },
    { svg: markRaw(CampingCar), consumption: 12 },
]

const selectedVehicle = ref(vehicles[1])
</script>