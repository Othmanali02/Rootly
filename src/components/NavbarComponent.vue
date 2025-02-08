<script setp>
import "../assets/app.css";

export default {
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
        <a href="/info" class="text-black hover:text-gray-400 text-lg">
          <img class="h-8" src="../assets/info.png" alt=" " />
        </a>
        <a href="https://github.com/Othmanali02/Rootly" class="text-black hover:text-gray-400 text-lg">
          <img class="h-8" src="../assets/github.png" alt=" " />
        </a>
      </div>
    </div>
    <hr>  
 </nav>

</template>




<style scoped>
</style>