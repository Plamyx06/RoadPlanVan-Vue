<script setup>
import RoadInformation from './RoadInformation.vue';
</script>

<template>
    <div class="bg-[#8A4852] bg-opacity-80 h-32 w-full rounded-lg drop-shadow-lg relative my-6 cursor-grab">
        <div class="flex">
            <div class="w-full h-20 pr-2">
                <img src="https://img-19.commentcamarche.net/wzKKufHO7dLH-WPFdXJHEmOmi7E=/1500x/smart/2d8c2b30aee345008ee860087f8bcdc9/ccmcms-commentcamarche/36120212.jpg"
                    alt="Drapeau rond" class=" w-full h-full rounded-lg">
            </div>
            <div class="flex justify-end pr-5 pt-1 w-3/4">
                <div class="flex flex-col ">
                    <p class="text-[#F8EDE0] text-sm font-semibold  truncate ">Voyage en Slovaquie</p>
                    <p class="text-[#F8EDE0]  text-sm truncate">départ le 24/11/2023</p>
                    <p class="text-[#F8EDE0] flex text-sm truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        10
                    </p>
                </div>
            </div>

        </div>
        <div>
            <RoadInformation class="text-beigeCustom mr-auto ml-auto" :duration="'0000'" :distance="'0000'"
                :price="'0000'" />
        </div>
        <div class="flex space-between h-9">
            <button class="w-full bg-beigeCustom rounded-bl-lg">
                Charger
            </button>
            <button class="w-full bg-[#8A4852] text-beigeCustom rounded-br-lg">
                Supprimer
            </button>
        </div>

    </div>
</template>
  
