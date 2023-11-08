<template>
  <VueDatePicker v-model="date" @update:model-value="handleDate" :enable-time-picker="false" locale="fr-FR"
    cancelText="annuler" selectText="valider" :format="format" min-date="new Date()" placeholder="Dâte de départ"
    :year-range="[2023, 2040]" teleport-center />
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import '../assets/style/data-picker-custom.css'

const date = ref(new Date());
console.log(date)
const props = defineProps({
  selectedDate: String
});
const propsDate = ref(new Date(props.selectedDate))

const format = (date) => {
  return date.toLocaleDateString('fr-FR')
}

const emit = defineEmits(["date-changed"]);

const handleDate = (modelData) => {
  date.value = new Date(modelData)
  console.log("je suis date", date.value)
  emit('date-changed', date.value);

  console.log("je suis props",)

}

</script>


<style scoped></style>
