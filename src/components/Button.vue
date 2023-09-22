<template>
  <button
    type="button"
    style="background-color: #8A4852; color: #F8F4E8;"
    class="justify-center rounded-full px-10 py-1.5 text-sm font-semibold shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800"
  >
    {{ text }}
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: String,

});

</script>
