<script setup>
import apiService from '@/services/apiRoutes';
</script>

<script>

export default {
  name: 'HomePage',
  props: ['user'],
  methods: {
    async mounted() {
      if (this.$props.user === null) {
        console.log("user does not exist")
      }
    },
    async handleLogin() {
      try {
        const response = await apiService.login();

        console.log(response.data);

      } catch (error) {
        console.log(error);

      }

    },
    async handleLogout() {
      try {
        await apiService.logout();

        window.location.href = "/";

      } catch (error) {
        console.log(error);

      }

    }
  }
}
</script>


<template>
  <div class="min-h-screen flex flex-col items-center justify-start p-6">
    <div class="w-full my-6 max-w-2xl">
      <h1 class="text-3xl md:text-4xl font-bold text-black">What is Rootly?</h1>
      <p class="mt-2 text-gray-700">
        Rootly is a web application designed to enhance plant breeding research and
        data management by integrating data import and ontology creation/storage.
        Motivated by the need to standardize data collection around the shared
        ontology of traits among researchers, Rootly uses the BrAPI standard and
        the open-source crop ontology framework by offering a lightweight web-app
        built with Vue.js.
      </p>
    </div>

    <div class="w-full my-6 max-w-2xl mt-10">
      <h2 class="text-3xl md:text-4xl font-bold text-black ">Powered By</h2>
      <div class="flex sm:flex-row justify-center items-center gap-6 my-3 mt-4 poweredBy">
        <img src="../assets/brapi-logo.svg" alt="BrAPI" />
        <img src="../assets/cropontology.png" alt="Crop Ontology" />
      </div>
    </div>

    <div class="w-full my-6 max-w-2xl mt-10">
      <h2 class="text-3xl md:text-4xl font-bold text-black">Get Started</h2>
      <p class="mt-2 text-gray-700">
        To get started, you can browse through the available traits to choose for
        your research project or you can start creating your own ontology using the
        intuitive and collaborative forms provided by Rootly.
      </p>


      <div v-if="this.$props.user">
        <div class="flex flex-col sm:flex-row justify-center gap-4 mt-4 mainBtns">
          <a href="/dashboard" class="w-full text-center font-bold text-lg px-6 py-2 text-white rounded-lg transition">
            Dashboard
          </a>
        </div>
        <div class="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <a @click="handleLogout"
            class="w-full bg-red-500 cursor-pointer text-center font-bold text-lg px-6 py-2 text-white rounded-lg transition">
            Logout
          </a>
        </div>
      </div>


      <div v-else>
        <div class="flex flex-col sm:flex-row justify-center gap-4 mt-4 mainBtns">
          <a href="/api/rootly/users/login"
            class="w-full bg-[#384e1d] text-center font-bold text-lg px-6 py-2 text-white rounded-lg transition">
            Login
          </a>
        </div>
      </div>







    </div>

  </div>
</template>




<style scoped></style>
