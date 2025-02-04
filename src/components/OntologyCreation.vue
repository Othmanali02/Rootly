<script setup>



</script>

<script>
export default {
  data() {
    return {
      items: [
        { name: "Apples" },
        { name: "Sainfoin" },
        { name: "Bananas" },
        { name: "Apples" },
        { name: "Sainfoin" },
        { name: "Bananas" },
        { name: "Apples" },
        { name: "Sainfoin" },
        { name: "Bananas" },
      ],
      selectedOntology: []
    };
  },
  methods: {
    selectItem(item) {
      if (!this.selectedOntology.includes(item.name)) {
        this.selectedOntology.push(item.name);
      }
    },
    genForm() {
      
    }
  }
};
</script>


<template>
  <div class="min-h-screen flex flex-col items-center justify-start p-6">
    <div class="w-full my-6 max-w-2xl">
      <h1 class="text-3xl md:text-4xl font-bold text-black">Choose the traits your are interested in</h1>
      <p class="mt-2 text-gray-700">
        You can get started with using Rootly by uploading a file for formatting.
      </p>

      <div class="w-full flex rounded-lg my-4 shadow-md overflow-hidden border border-gray-300">
        <div class="w-1/3 bg-gray-100">
          <ul>
            <li class="px-4 py-3 bg-gray-300 border font-bold cursor-pointer ">Term</li>
            <li v-for="(item, index) in items" :key="index" @click="selectItem(item)"
              class="px-4 py-3 hover:bg-gray-300 border font-bold cursor-pointer">
              {{ item.name }}
            </li>
          </ul>
        </div>

        <div class="w-2/3 bg-white">
          <ul class="">
            <li class="text py-3 border px-4 bg-gray-300 font-semibold">{Ontology Name}</li>

            <li v-for="(selected, index) in selectedOntology" :key="index" class="px-4 py-3 border">
              {{ selected }}
            </li>
          </ul>
        </div>
      </div>

      <button @click="genForm" class="p-3 my-6 bg-blue-500 cursor-pointer rounded">
        <h1 class="text-xl px-3 font-semibold text-white">Generate forms</h1>

      </button>

    </div>
  </div>
</template>

<style scoped></style>
