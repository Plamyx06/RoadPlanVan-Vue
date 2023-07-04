<template>
  <div class="product">
    <h1>Liste des produits :</h1>
    <ul>
      <li v-for="produit in produits" :key="produit.id">
        {{ produit.title }} - {{ produit.price }}€€
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      produits: []
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts() {
      fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
          this.produits = data.products;
        })
        .catch(error => {
          console.error('Une erreur s\'est produite lors de la récupération des produits :', error);
        });
    }
  }
};
</script>


  