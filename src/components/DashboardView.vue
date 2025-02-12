<script setup>
import axios from 'axios';
</script>

<script>

export default {
  data() {
    return {
      lists: [],
      searchQuery: '',

    };
  },
  async mounted() {
    try {
      console.log("Mounted");

      // should send the users credentials with the request so that the backend gets
      // only that users lists and shared lists

      const response = await axios.get(`http://localhost:3000/getLists`);
      this.lists = response.data.results;
      console.log(this.lists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  methods: {
    genLink(listName) {
      return "/list/" + listName["List ID"];
    },
  },
  computed: {
    filteredLists() {
      return this.lists.filter((item) => {
        return item.Name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  name: 'DashboardView',
}
</script>




<template>
  <div class="min-h-screen flex flex-col items-center justify-start p-6">
    <div class="w-full my-6 max-w-2xl text-center dashItems">
      <div class="text-center">
        <h1 class="text-xl font-bold text-center my-2">Dashboard</h1>
        <h2 class="text-lg font-semibold text-center">Signed in as, Othman</h2>
        <a href="/login" class="text-blue-600 hover:underline ">Don't have an account? Sign in here</a>
      </div>

      <h1 class="text-xl font-bold text-left my-4">My lists</h1>

      <div class="bg-gray-200 p-3 max-h-96 overflow-y-auto rounded-lg shadow-lg">
        <div class="flex items-center space-x-2 mb-6">
          <input v-model="searchQuery" type="text" placeholder="Search..."
            class="w-full sm:w-1/2 px-4 py-2 flex-grow rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <!-- <a href="/create"
            class="flex items-center bg-[#3a5d3f] text-white px-2 py-2 rounded-lg shadow-md text-lg font-semibold transition-all duration-300 transform hover:bg-[#2f4f2f] ml-auto">
            <span><img class="h-6 w-6 invert" src="../assets/sort.png" /></span>
          </a> -->
          <a href="/create"
            class="flex items-center bg-[#3a5d3f] text-white px-4 py-2 rounded-lg shadow-md font-semibold transition-all duration-300 transform hover:bg-[#2f4f2f] ml-auto">
            <span>Create List</span>
          </a>
        </div>

        <div v-if="filteredLists.length > 0">
          <ul class="space-y-1">
            <li v-for="(item, index) in filteredLists" :key="index"
              class="flex items-left text-left font-semibold bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-all duration-300">
              <a :href="genLink(item)" target="_blank" class="w-full">
                {{ item.Name }}
              </a>
            </li>
          </ul>
        </div>
        <div v-else class="text-center text-gray-600">
          <p>No lists found.</p>
        </div>
      </div>


      <hr class="my-6">

      <h1 class="text-xl font-bold text-left my-4">Shared lists</h1>
      <div class="bg-gray-200 p-6 rounded-lg shadow-md">
        <a href="/create"
          class="bg-[#3a5d3f] text-white px-6 py-3 rounded-lg shadow-md text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-[#3a5d3f]">

          Create List
        </a>
      </div>

      <hr class="my-6">


    </div>
  </div>
</template>