<template>
    <div class="rounded-full bg-red-100 p-1.5 w-11/12">
        <div class="flex">
            <div class="flex-shrink-0">
                <XCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ text }}</h3>
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