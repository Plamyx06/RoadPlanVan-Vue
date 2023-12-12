<script setup>
import RoundedButton from '@/components/button/RoundedButton.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { defineEmits } from 'vue';
import TripCard from '@/components/mapView/cards/TripCard.vue';

const emit = defineEmits(['close']);

function closeModal() {
    emit('close');
}
</script>


<template >
    <div class="relative flex flex-1 flex-col justify-center py-12 lg:px-8 w-full h-screen lg">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        <div class="sm:mx-auto sm:w-full sm:max-w-[480px] shadow rounded-lg relative">

            <div class="bg-beige-custom px-6 py-6 shadow rounded-lg sm:px-6">
                <div class="flex justify-between items-center">
                    <div class="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 class=" text-center text-2xl font-bold leading-9 tracking-tight text-red-custom ">Mes trajets
                        </h2>
                    </div>
                    <div>
                        <RoundedButton @click="closeModal">
                            <XMarkIcon class="h-4 w-4" />
                        </RoundedButton>
                    </div>
                </div>
                <TripCard />
                <TripCard />
                <TripCard />
            </div>
        </div>
    </div>
</template>
  
