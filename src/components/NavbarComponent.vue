<script>
import "../assets/app.css";


export default {
  data() {
    return {
      menuStatus: false
    };
  },
  methods: {
    handleMenuOpen() {
      this.menuStatus = true;
    },
    handleMenuClose() {
      this.menuStatus = false;
    }
  },
  name: 'NavbarComponent'
};
</script>

<template>
  <nav class="w-full py-6 shadow-md">
    <div class="navItems text-center px-4">
      <a href="/">
        <img src="../assets/logomockup6.png" alt="Rootly" class="h-24 text-center mx-auto" />
      </a>

      <div class="flex space-x-3 justify-center items-center mt-4 md:mt-0">
        <a @click="handleMenuOpen" class="text-black cursor-pointer hover:text-gray-400 text-lg">
          <img class="h-8" src="../assets/menuBurger.png" alt=" " />
        </a>
        <a href="/about" class="text-black hover:text-gray-400 text-lg">
          <img class="h-8" src="../assets/info.png" alt=" " />
        </a>
        <a href="https://github.com/Othmanali02/Rootly" class="text-black hover:text-gray-400 text-lg">
          <img class="h-8" src="../assets/github.png" alt=" " />
        </a>
      </div>
    </div>
    <hr>
  </nav>

  <div v-if="menuStatus" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 h-[450px] overflow-y-auto rounded-lg shadow-xl w-11/12 sm:w-1/3">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Quick Access</h2>
        <button class="px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600" @click="handleMenuClose">
          Close
        </button>
      </div>

      <ul class="space-y-4 text-center">
        <li><a href="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</a></li>
      </ul>
    </div>
  </div>

</template>




<style scoped></style>