<script setup>
import roundedButton from '@/components/roundedButton.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { defineEmits } from 'vue';
import TripCard from '../TripCard.vue';

const emit = defineEmits(['close']);

function closeModal() {
    emit('close');
}
</script>


<template >
    <div class="relative flex flex-1 flex-col justify-center py-12   lg:px-8 w-full h-screen">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        <div class="sm:mx-auto sm:w-full sm:max-w-[480px] shadow rounded-lg px-6 py-12 relative">


            <div class="bg-beigeCustom px-6 py-6 shadow rounded-lg sm:px-12">
                <div class="flex justify-between items-center">
                    <div class="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 class=" text-center text-2xl font-bold leading-9 tracking-tight text-redCustom ">Mes trajets
                        </h2>
                    </div>
                    <div>
                        <roundedButton @click="closeModal">
                            <XMarkIcon class="h-3 w-3" />
                        </roundedButton>
                    </div>
                </div>
                <TripCard />
                <TripCard />
                <TripCard />

            </div>
        </div>
    </div>
</template>
  
<style scoped></style>