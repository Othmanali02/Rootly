<script setup>
import FooterComponent from './components/FooterComponent.vue';
import NavbarComponent from './components/NavbarComponent.vue';

import { RouterView } from "vue-router";
</script>

<template>
  <NavbarComponent />

	<RouterView />

  <FooterComponent />
</template>


<style>
</style>