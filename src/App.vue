<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/Homepage.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/product">Product</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

