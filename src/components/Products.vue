<template>
  <div class="product">
    <h1>Liste des produits :</h1>
    <ul>
      <li v-for="product in dataProducts" :key="product.id">
        {{ product.title }} - {{ product.price }}€
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const dataProducts = ref([])

const fetchProducts = () => {
  fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
      dataProducts.value = data.products;

    })
    .catch(error => {
      console.error(error);
    });
};
onMounted(fetchProducts)
</script>






  