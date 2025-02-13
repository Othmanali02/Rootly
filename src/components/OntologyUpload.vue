<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from "vue-toastification";


const file = ref(null);

const uploadFile = async () => {
  const toast = useToast();



  if (!file.value) {
    toast('Please select a file first.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file.value);

  try {
    const response = await axios.post('http://localhost:3000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success("File Uploaded Successfully", {
      timeout: 4000
    });
    console.log(response.data);
  } catch (error) {
    console.error('Upload failed:', error);
    toast.error("Incorrect File Type", {
      timeout: 4000
    });

  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start p-6">
    <div class="w-full my-6 max-w-2xl">
      <h1 class="text-3xl md:text-4xl font-bold text-black">Upload a file to get started</h1>
      <p class="mt-2 text-gray-700">
        You can get started with using Rootly by uploading a file for formatting.
      </p>

      <input type="file" @change="(e) => (file = e.target.files[0])" class="mt-4 border p-2 w-full rounded-md" />

      <button @click="uploadFile" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Upload File
      </button>

      <p class="mt-2 text-gray-700">
        Below is a form that represents the data in the CSV file
      </p>
    </div>
  </div>
</template>

<style scoped></style>
