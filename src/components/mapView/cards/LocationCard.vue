<script setup>
import { ref, defineProps } from 'vue'
import Spinner from '@/components/mapView/Spinner.vue'

const props = defineProps({
  city: String,
  country: String,
  countryCode: String
})

const isLoading = ref(false)
</script>

<template>
  <div
    class="bg-[#8A4852] bg-opacity-80 h-12 w-3/4 flex items-center rounded-full hover:bg-[#8A4852] drop-shadow-lg relative my-6 cursor-grab"
  >
    <div>
      <Spinner v-if="isLoading" class="m-1 w-10 h-10 rounded-full" />
      <img
        v-if="!isLoading"
        :src="`https://flagcdn.com/w320/${countryCode}.png`"
        alt="Drapeau rond"
        class="m-1 w-10 h-10 rounded-full"
      />
      <div class="absolute top-0 left-0 w-10 h-10 m-1 bg-black opacity-10 rounded-full"></div>
    </div>
    <div class="flex space-between w-3/4">
      <div class="w-full">
        <p v-if="city" class="text-[#F8EDE0] text-sm mx-3 truncate capitalize">{{ city }}</p>
        <p v-if="country" class="text-[#F8EDE0] font-semibold text-sm mx-3 truncate w-4/6">
          {{ country }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
