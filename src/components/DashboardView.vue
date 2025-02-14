<script setup>
import axios from 'axios';
</script>

<script>
export default {
  props: ['user'],
  data() {
    return {
      lists: [],
      searchQuery: '',
      loadingScreen: false,

    };
  },
  async mounted() {
    try {
      // should send the users credentials with the request so that the backend gets
      // only that users lists and shared lists
      this.loadingScreen = true;
      const response = await axios.post(`http://localhost:3000/getUserLists`, {
        email: this.$props.user.email
      });
      console.log(response);
      this.lists = response.data;
      this.loadingScreen = false;
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
        <h2 v-if="this.$props.user" class="text-lg font-semibold text-center">Signed in as, {{ this.$props.user.name }}
        </h2>

        <a v-else href="/api/login" class="text-blue-600 hover:underline ">Don't have an account? Sign in here</a>
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

        <div v-if="this.loadingScreen">
          <img src="../assets/rootlygif.gif" class="h-32 mx-auto" />

        </div>

        <div v-else>
          <div v-if="filteredLists.length > 0">
            <ul class="space-y-1">
              <li v-for="(item, index) in filteredLists" :key="index"
                class="flex items-left text-left font-semibold bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-all duration-300">
                <a :href="genLink(item)" class="w-full">
                  {{ item.Name }}
                </a>
              </li>
            </ul>
          </div>
          <div v-else class="text-center text-gray-600">
            <p>No lists found.</p>
          </div>
        </div>

      </div>


      <hr class="my-6">

      <h1 class="text-xl font-bold text-left my-4">My teams</h1>
      <div class="bg-gray-200 p-3 max-h-96 overflow-y-auto rounded-lg shadow-lg">
        <div class="flex items-center space-x-2 mb-6">
          <input v-model="searchQuery" type="text" placeholder="Search..."
            class="w-full sm:w-1/2 px-4 py-2 flex-grow rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <!-- <a href="/create"
            class="flex items-center bg-[#3a5d3f] text-white px-2 py-2 rounded-lg shadow-md text-lg font-semibold transition-all duration-300 transform hover:bg-[#2f4f2f] ml-auto">
            <span><img class="h-6 w-6 invert" src="../assets/sort.png" /></span>
          </a> -->
          <a href="/teams/create"
            class="flex items-center bg-blue-400 text-white px-4 py-2 rounded-lg shadow-md font-semibold transition-all duration-300 transform ml-auto">
            <span>Create Team</span>
          </a>
        </div>

        <!-- <div v-if="this.loadingScreen">
          <img src="../assets/rootlygif.gif" class="h-32 mx-auto" />

        </div> -->

        <div>
          <ul class="space-y-1">
              <li 
                class="flex items-left text-left font-semibold bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-all duration-300">
                <a class="w-full">
                  Team 1
                </a>
              </li>
            </ul>
          <!-- <div v-if="filteredLists.length > 0">
            <ul class="space-y-1">
              <li v-for="(item, index) in filteredLists" :key="index"
                class="flex items-left text-left font-semibold bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-all duration-300">
                <a :href="genLink(item)" class="w-full">
                  {{ item.Name }}
                </a>
              </li>
            </ul>
          </div> -->
          <div  class="text-center text-gray-600">
            <p>No lists found.</p>
          </div>
        </div>

      </div>



    </div>
  </div>
</template>