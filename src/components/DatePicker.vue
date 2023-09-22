<template>
    <VueDatePicker class="" v-model="date" :enable-time-picker="false"  locale="fr-FR" cancelText="annuler" selectText="valider" :format="format" min-date="new Date()" placeholder="Dâte de départ" :year-range="[2023, 2040]" teleport-center />
</template>

<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import '/home/plamyx/Code/RoadPlanVan/src/assets/style/data-picker-custom.css'

const date = ref(new Date());

const addZero = (num) => (num < 10 ? '0' : '') + num;

const format = (date) => {
  const day = addZero(date.getDate());
  const month = addZero(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

</script>

<style scoped>

</style>
