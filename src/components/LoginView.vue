<script>
export default {
  data() {
    return {
      isSignUp: false, 
      email: '',
      password: '',
    };
  },
  methods: {
    async handleSubmit() {
      if (this.isSignUp) {
        console.log('Signing up with', this.email, this.password);
        
      } else {


        console.log('Logging in with', this.email, this.password);
      }
      this.email = '';
      this.password = '';
      // re-direct to the dashboard
    },
    toggleForm() {
      this.isSignUp = !this.isSignUp;
    },
  },
};
</script>


<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 h-96 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">{{ isSignUp ? 'Sign Up' : 'Login' }}</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
            <input
              id="email"
              type="email"
              v-model="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
            <input
              id="password"
              type="password"
              v-model="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            {{ isSignUp ? 'Sign Up' : 'Login' }}
          </button>
        </form>
          <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            {{ isSignUp ? 'Already have an account?' : 'Don\'t have an account?' }}
            <button
              @click="toggleForm"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              {{ isSignUp ? 'Login' : 'Sign Up' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </template>
  