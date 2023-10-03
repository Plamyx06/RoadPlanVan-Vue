<script setup>

import { ref } from "vue";
import LocationCard from '../components/LocationCard.vue'







</script>


<template>  
<div class="container fixed mt-[264px] px-5 h-[400px]" >
<div class="w-1/2 flex justify-center">
<div id="geocoder" class="geocoder"></div>
</div>
<LocationCard />
</div>

</template>

<style scoped>
.container
{font-family: 'Kalam', cursive;
background-color: #F8EDE0;
color: #8A4852;
};
body { margin: 0; padding: 0; }

</style>
