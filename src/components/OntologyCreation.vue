<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';

</script>

<script>
const items = ref([]);
const toast = useToast();

export default {
  props: ['user'],
  data() {
    return {
      selectedOntology: [],
      selectedOntologySelected: null,
      selectedDetails: [],
      selectedTerm: null,
      selectedOntologyDbId: null,
      selectedTraits: [],
      selectedVariable: null,
      selectedVariableDetails: [],
      fetchTermDetails: false,
      fetchVariableDetails: false,
      listName: ""
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://127.0.0.1:5900/brapi/v2/ontologies?pageSize=100');

      items.value = response.data.result.data[0];



    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  methods: {
    selectItem(item) {
      if (this.selectedTerm === item.ontologyName) {
        this.selectedTerm = null;
        this.selectedOntologyDbId = null;
        this.selectedOntology = [];
        this.selectedOntologySelected = null;
        this.selectedDetails = [];
        this.selectedVariableDetails = [];

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        this.selectedTerm = item.ontologyName;
        this.selectedOntologyDbId = item.ontologyDbId;
        this.selectedOntology = item.additional_info.term_names;
        this.selectedOntologySelected = null;
        this.selectedDetails = [];
        this.selectedVariableDetails = [];

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    async selectOntology(ontology) {
      this.selectedDetails = null;
      this.selectedOntologySelected = ontology;
      this.fetchTermDetails = true;
      try {
        const response = await axios.get(`http://127.0.0.1:5900/brapi/v2/variables?pageSize=100&ontologyDbId=${this.selectedOntologyDbId}&traitClass=${ontology}`);
        console.log(response.data.result);

        this.selectedDetails = response.data.result;
        this.fetchTermDetails = false;

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    },
    async selectVariable(variable) {
      this.selectedVariableDetails = null;
      this.fetchVariableDetails = true;
      try {
        const response = await axios.get(`http://127.0.0.1:5900/brapi/v2/variables?pageSize=100&observationVariableDbId=${variable}`);
        console.log(response.data.result);

        this.selectedVariableDetails = response.data.result;
        this.fetchVariableDetails = false;

      } catch (error) {
        console.error('Error fetching data:', error);
      }


    },
    async createList() {

      try {

        let traits = this.selectedTraits;
        const response = await axios.post("http://localhost:3000/rootly/lists/createList", {
          traits: traits,
          listName: this.listName,
          userId: this.$props.user.UUID
        });
        console.log(response.data);

        this.selectedDetails = response.data.result;
        this.fetchTermDetails = false;

        this.selectedTerm = null;
        this.selectedOntologyDbId = null;
        this.selectedOntology = [];
        this.selectedOntologySelected = null;
        this.selectedDetails = [];
        this.selectedTraits = [];
        this.selectedVariableDetails = null;
        let listID = response.data["List ID"];

        localStorage.setItem("listCreated", this.listName);
        window.location.href = "/lists/" + listID;


      } catch (error) {
        toast.error("Encountered an error, try again.", {
          timeout: 4000
        });
        console.error('Error fetching data:', error);
      }

    },
    removeItem(trait) {
      this.selectedTraits = this.selectedTraits.filter(item => item.observationVariableDbId !== trait.observationVariableDbId);
    },
    genForm() {
      // this function should be able to consume the metadata of the trait and generate forms for the client to fill up 
      // then generate a csv file

    }
  }
};
</script>


<template>
  <div class="  flex flex-col items-center justify-start p-6">
    <h1 class="text-3xl md:text-4xl font-bold text-black w-1/2 text-center">Choose the variables that your are
      interested in researching</h1>
    <p class="mt-2 text-gray-700 w-1/2 text-center">
      Below is an Ontology variable viewer that integrates with cropontology.com, you can get started by choosing an
      ontology you want to work on and then selecting a specific term for that ontology, and that would display all the
      variables associated with that term.
    </p>
    <div class="w-full diyTable overflow-y-auto my-6 max-w-3xl">

      <div
        class="w-full flex rounded-lg my-0 shadow-md overflow-hidden border border-gray-300 transition-all duration-300">
        <div :class="['transition-all duration-300', selectedTerm ? ('w-1/6') : 'w-1/2', 'bg-gray-100']">
          <ul>
            <li class="px-4 py-3 bg-gray-300 border font-bold cursor-pointer sticky top-0 z-10">Ontology</li>
            <li v-for="(item, index) in items" :key="index" @click="selectItem(item)"
              :class="['px-4 py-3 border font-bold cursor-pointer', selectedTerm === item.ontologyName ? 'bg-blue-500 text-white' : '']">
              {{ item.ontologyName }}
            </li>
          </ul>
        </div>

        <div :class="['transition-all duration-300', selectedTerm ? 'w-1/3' : 'w-1/4', 'bg-white']">
          <ul>
            <li class="text py-3 border px-4 bg-gray-300 font-semibold">Term</li>
            <li v-for="(ontology, index) in selectedOntology" :key="index" @click="selectOntology(ontology)"
              :class="['px-4 py-3 border cursor-pointer', selectedOntologySelected === ontology ? 'bg-blue-500 text-white' : '']">
              {{ ontology }}
            </li>
          </ul>
        </div>

        <div :class="['transition-all duration-300', selectedOntology.length ? 'w-1/2' : 'w-1/5', 'bg-gray-50']">
          <ul>
            <!-- // should make this display Variables instead of traits, but needs API work. -->
            <li class="text py-3 border px-4 bg-gray-300 font-semibold">Variables</li>
            <div v-if="fetchTermDetails" class="flex justify-center py-4 my-12">
              <img class="h-24" src="../assets/rootlygif.gif" alt="Loading" />

            </div>
            <li v-for="(detail, index) in selectedDetails" :key="index"
              class="px-4 py-3 border cursor-pointer capitalize">
              <input type="checkbox" v-model="selectedTraits" :value="detail" class="mr-5" />
              <div class="inline" @click="selectVariable(detail.observationVariableDbId)">{{ detail.trait.traitName }}
              </div>
            </li>
          </ul>
        </div>

        <div :class="['transition-all duration-300', selectedOntology.length ? 'w-1/2' : 'w-1/4', 'bg-white']">
          <ul>
            <li class="text py-3 border px-4 bg-gray-300 font-semibold">Details</li>

            <div v-if="fetchVariableDetails" class="flex justify-center py-4 my-12">
              <img class="h-24" src="../assets/rootlygif.gif" alt="Loading" />

            </div>
            <li v-for="(detail, index) in selectedVariableDetails" :key="index" class="px-4 py-3 border capitalize">
              <div>{{ detail.observationVariableDbId }}</div>
              <div>{{ detail.observationVariableName }}</div>

            </li>
          </ul>
        </div>


      </div>

    </div>
    <h4 class="text-xl font-semibold text-center my-4">Chosen Variables:</h4>

    <div class="bg-gray-200 p-6 rounded-lg shadow-md mb-6 w-1/3 flex flex-wrap gap-4 justify-start">

      <div v-for="(trait, index) in selectedTraits" :key="index" class="">
        <div class="flex items-center bg-gray-300 p-4 rounded-lg space-x-2">

          <span class="text-sm text-gray-900">{{ trait.trait.traitName }}</span>
          <button @click="removeItem(trait)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-check-circle text-black">X</i>
          </button>

        </div>

      </div>
    </div>

    <div class="flex flex-col items-center justify-center space-y-6">
      <h4 class="text-xl font-semibold text-center">List Name:</h4>
      <input v-model="listName"
        class="mt-2 px-6 py-3 border border-gray-300 bg-gray-100 text-black font-medium rounded w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        placeholder="Enter list name" />
      <button @click="createList"
        class="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded w-96 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
        Create List
      </button>
    </div>

  </div>
</template>

<style scoped></style>
