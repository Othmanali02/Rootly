<script setup>
import apiService from "../services/apiRoutes";
import { useToast } from "vue-toastification";
</script>

<script>
const toast = useToast();

export default {
  props: ['user'],
  data() {
    return {
      lists: [],
      myTeams: [],
      sharedTeams: [],
      searchQuery: '',
      teamSearchQuery: '',
      sharedTeamSearchQuery: '',
      loadingScreen: false,
      editingItem: null

    };
  },
  async mounted() {
    try {
      // should send the users credentials with the request so that the backend gets
      // only that users lists and shared lists
      this.loadingScreen = true;
      // should change this to work with UUID

      const response = await apiService.getUserLists(this.$props.user.email);


      console.log(response.data);
      // this is to get the teams 

      const teamresponse = await apiService.getUserTeams(this.$props.user.UUID);

      this.myTeams = teamresponse.data.teamList;
      this.sharedTeams = teamresponse.data.sharedTeams;
      this.lists = response.data;
      this.loadingScreen = false;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  methods: {
    genLink(listName) {
      return "/lists/" + listName["id"];
    },
    genTeamLink(team) {
      return "/teams/" + team["id"];
    },
    startRemove(item) {
      this.editingItem = item;
    },

    async handleRemoveClick(list) {
      try {
       console.log(list);
        const response = await apiService.removeUserList(list.id);
        console.log(response.data);
        toast.success("List Removed", {
          timeout: 4000
        });

        let id = list.id;

        const index = this.lists.findIndex(item => item.id === id);
        if (index !== -1) {
          this.lists.splice(index, 1);
        }

        this.editingItem = null;
      } catch (error) {
        toast.success("Oops! Something went wrong.", {
          timeout: 4000
        });

        console.log(error);
      }
    },
  },
  computed: {
    filteredLists() {
      return this.lists.filter((item) => {
        return item.Name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    filteredTeams() {
      return this.myTeams.filter((item) => {
        return item.Name.toLowerCase().includes(this.teamSearchQuery.toLowerCase());
      });
    },
    filteredSharedTeams() {
      return this.sharedTeams.filter((item) => {
        return item.Name.toLowerCase().includes(this.sharedTeamSearchQuery.toLowerCase());
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
          <a href="/lists/create"
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


                <span class="ml-4 flex items-center">
                  <button v-if="editingItem !== item" @click="startRemove(item)"
                    class="text-gray-600 hover:text-gray-900 transition-all duration-300">
                    <i class="fas fa-pencil-alt">Edit</i>
                  </button>
                  <button v-if="editingItem === item" @click="handleRemoveClick(item)"
                    class="text-red-500 hover:text-red-700 transition-all duration-300">
                    Remove
                  </button>
                </span>
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
          <input v-model="teamSearchQuery" type="text" placeholder="Search..."
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

        <div v-if="this.loadingScreen">
          <img src="../assets/rootlygif.gif" class="h-32 mx-auto" />

        </div>


        <div v-else>
          <div v-if="filteredTeams.length > 0">
            <ul class="space-y-1">
              <li v-for="(item, index) in filteredTeams" :key="index"
                class="flex items-left text-left font-semibold bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-all duration-300">
                <a :href="genTeamLink(item)" class="w-full">
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


      <h1 class="text-xl font-bold text-left my-4">Shared teams</h1>
      <div class="bg-gray-200 p-3 max-h-96 overflow-y-auto rounded-lg shadow-lg">
        <div class="flex items-center space-x-2 mb-6">
          <input v-model="sharedTeamSearchQuery" type="text" placeholder="Search..."
            class="w-full sm:w-1/2 px-4 py-2 flex-grow rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <!-- <a href="/create"
            class="flex items-center bg-[#3a5d3f] text-white px-2 py-2 rounded-lg shadow-md text-lg font-semibold transition-all duration-300 transform hover:bg-[#2f4f2f] ml-auto">
            <span><img class="h-6 w-6 invert" src="../assets/sort.png" /></span>
          </a> -->

        </div>

        <div v-if="this.loadingScreen">
          <img src="../assets/rootlygif.gif" class="h-32 mx-auto" />

        </div>


        <div v-else>
          <div v-if="filteredSharedTeams.length > 0">
            <ul class="space-y-1">
              <li v-for="(item, index) in filteredSharedTeams" :key="index"
                class="flex items-left text-left font-semibold bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-all duration-300">
                <a :href="genTeamLink(item)" class="w-full">
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


    </div>
  </div>
</template>