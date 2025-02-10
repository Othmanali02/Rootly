<script setup>

</script>

<script>

export default {
  data() {
    return {

    };
  },
  async mounted() {
    try {
      console.log("Mounted");

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  methods: {

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

      <hr class="my-3">

      <h1 class="text-xl font-bold text-left my-4">My lists</h1>
      <div class="bg-gray-200 p-6 rounded-lg shadow-md">
        <button class="bg-[#384e1d] text-white px-4 py-2 rounded-lg">
          Create List
        </button>
      </div>

    </div>
  </div>
</template>