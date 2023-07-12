<script setup>
import Layout from '../components/Layout.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main>
    <body class="h-full">
    
    <div class="relative">
      <img class="object-cover min-w-[320px] min-h-[500px] max-h-[800px] w-full " src="@/assets/main-img.jpg" alt="Van dans le désert"/>
      <h1 class="absolute inset-0 flex justify-center items-center text-center font-bold text-4xl md:text-6xl" style="-webkit-text-stroke: 0.5px #ffffff; font-family: 'Kalam', cursive; color: #8A4852;">
        ROADPLANVAN<br>
        TON COMPAGNON DE VOYAGE<br>
        planifie, explore, profite !
      </h1>
    </div>
    <div class="m-5" >
    <h1 class="flex justify-center text-center text-xl font-bold">Tu prépares un long roadtrip ?</h1>
    <p class="m-3 justify-center text-lg">Tu as une liste de villes, monuments et autres merveilles à découvrir, tant d'endroits magnifiques qu'il devient difficile de savoir par où commencer...</p>
    <div class="justify-center items-center">
    <img class="mx-auto w-11/12" src="@/assets/cardWithPin.png"/>
  </div> 
  <div class="flex justify-center space-between m-5"><router-link to="/product">
   <button type="button" style="background-color: #8A4852; color: #F8F4E8;" class="mr-10 justify-centerg rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800">Fiche Produit</button>
  </router-link>
  <router-link to="/main">
   <button type="button" style="background-color: #8A4852; color: #F8F4E8;" class="justify-centerg rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800">C'est parti ?</button>
  </router-link></div>
</div>
<Layout/>
</body>
    
  </main>
</template>

<style scoped>
body
{font-family: 'Kalam', cursive;
background-color: #F8EDE0;
};


</style>
