<template>
  <VueDatePicker v-model="date" @update:model-value="handleDate" :enable-time-picker="false" locale="fr-FR"
    cancelText="annuler" selectText="valider" :format="format" min-date="new Date()" placeholder="Dâte de départ"
    :year-range="[2023, 2040]" :teleport="true" teleport-center :clearable="false" />
</template>

<script setup>
import { ref, defineEmits, } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/style/data-picker-custom.css'

const date = ref(new Date());

const savedDate = localStorage.getItem('selectedDate');
if (savedDate) {
  date.value = new Date(savedDate);
}

const format = (date) => {
  return date.toLocaleDateString('fr-FR')
}

const emit = defineEmits(["date-changed"]);

const handleDate = (modelData) => {
  date.value = new Date(modelData);
  localStorage.setItem('selectedDate', date.value.toISOString());

}

</script>





<style scoped></style>
