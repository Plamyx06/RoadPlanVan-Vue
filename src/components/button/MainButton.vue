<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: String,
});

</script>

<template>
  <button type="button"
    class="justify-center bg-red-custom text-beige-custom rounded-full px-10 py-1.5 text-sm font-semibold shadow-sm hover:bg-red-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-custom">
    <slot />
  </button>
</template>


