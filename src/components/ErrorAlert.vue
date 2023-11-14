<template>
    <div class="rounded-full bg-red-100 py-1 w-11/12">
        <div class="flex items-center">
            <div class="">
                <XCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div class="ml-3">
                <h3 class=" font-medium text-redCustom">{{ text }}</h3>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { defineProps } from 'vue'

const props = defineProps({
    text: String
})
</script>