<script setup>

import { ref } from 'vue';
import axios from 'axios';

</script>

<script>

const items = ref([]);


export default {
  data() {
    return {
      selectedOntology: [],
      selectedOntologySelected: null,
      selectedDetails: [],
      selectedTerm: null,
      selectedOntologyDbId: null,
      selectedTraits: []
    };
  },
  async mounted() {
      try {
        const response = await axios.get('http://127.0.0.1:5900/brapi/v2/ontologies?pageSize=100');

        items.value = response.data.result.data[0];
        console.log(response.data.result.data[0]);
        
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
      } else {
        this.selectedTerm = item.ontologyName;
        this.selectedOntologyDbId = item.ontologyDbId;
        this.selectedOntology = item.additional_info.term_names;
        this.selectedOntologySelected = null;
        this.selectedDetails = [];
      }
    },
    async selectOntology(ontology) {
      this.selectedOntologySelected = ontology;

      console.log(this.selectedTerm + " - " + ontology + " - " + this.selectedOntologyDbId);
      try {
        const response = await axios.get(`http://127.0.0.1:5900/brapi/v2/traits?pageSize=100&traitClass=${ontology}&ontologyDbId=${this.selectedOntologyDbId}`);
        console.log(response.data.result);

        this.selectedDetails = response.data.result;

        
      } catch (error) {
        console.error('Error fetching data:', error);
      }

    },
    clearSelected (){
      console.log(this.selectedTerm)
      // if(this.selectedTerm !== ""){
      //   this.selectedOntology = [];
      //   this.selectedOntologySelected= null;
      //   this.selectedDetails=  [];
      //   this.selectedTerm = null;
      //   this.selectedOntologyDbId = null;
      // }
    
    },
    showSelectedTraits() {
      alert("Selected Traits: " + this.selectedTraits.join(", "));
    },
    genForm() {
      // this function should be able to consume the metadata of the trait and generate forms for the client to fill up 
      // then generate a csv file

    }
  }
};
</script>


<template>
  <div class="min-h-screen flex flex-col items-center justify-start p-6">
    <div class="w-full my-6 max-w-3xl">
      <h1 class="text-3xl md:text-4xl font-bold text-black">Choose the traits your are interested in</h1>
      <p class="mt-2 text-gray-700">
        Choose the variables you would like to work with.
      </p>

      <div
        class="w-full flex rounded-lg my-4 shadow-md overflow-hidden border border-gray-300 transition-all duration-300"
        >
        <div :class="['transition-all duration-300', selectedTerm ? ('w-1/6') : 'w-1/2', 'bg-gray-100']">
          <ul>
            <li class="px-4 py-3 bg-gray-300 border font-bold cursor-pointer">Ontology</li>
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

        <div :class="['transition-all duration-300', selectedOntology.length ? 'w-1/2' : 'w-1/4', 'bg-gray-50']">
          <ul>
            <!-- // should make this display Variables instead of traits, but needs API work. -->
            <li class="text py-3 border px-4 bg-gray-300 font-semibold">Traits</li>
            <li v-for="(detail, index) in selectedDetails" :key="index" class="px-4 py-3 border capitalize">
              <input 
                type="checkbox" 
                v-model="selectedTraits" 
                :value="detail.traitName" 
                class="mr-5"
              />
              {{ detail.traitName }}
            </li>
          </ul>
        </div>
      </div>

      <button @click="genForm" class="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded w-full">
        <h1 class="px-3 font-semibold text-white">Generate forms</h1>

      </button>

      <button 
        @click="showSelectedTraits" 
        class="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded w-full">
        Show Selected Traits
      </button>

    </div>
  </div>
</template>

<style scoped></style>
