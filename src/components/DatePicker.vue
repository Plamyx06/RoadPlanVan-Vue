<template>
  <VueDatePicker class="" v-model="date" @update:model-value="handleDate" :enable-time-picker="false" locale="fr-FR"
    cancelText="annuler" selectText="valider" :format="format" min-date="new Date()" placeholder="Dâte de départ"
    :year-range="[2023, 2040]" teleport-center />
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import '../assets/style/data-picker-custom.css'

const date = ref(new Date().toISOString());

const props = defineProps({
  selectedDate: String // Utilisez cette prop pour initialiser `date`
});
console.log(props.selectedDate)

const format = (date) => {
  return date.toLocaleDateString('fr-FR')
}

const emit = defineEmits(["date-changed"]);

const handleDate = (modelData) => {

  console.log("je suis date", modelData)
  emit('date-changed', modelData);

}

</script>


<style scoped></style>
