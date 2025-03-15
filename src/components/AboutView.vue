<script>
import "../assets/app.css";

export default {
    data() {
        return {
            menuStatus: false
        };
    },
    methods: {
        handleMenuOpen() {
            this.menuStatus = true;
        },
        handleMenuClose() {
            this.menuStatus = false;
        }
    },
    name: 'AboutView'
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center ">
        <div class="container mx-auto p-6 bg-white rounded-lg shadow-lg ">
            <div class="flex items-center justify-between mb-8 bg-[#384e1d] p-4 rounded-lg">
                <h1 class="text-3xl font-bold text-white">About Rootly</h1>
            </div>

            <section class="text-left mb-8">
                <img src="../assets/ardeea.png" alt="Project Curators"
                    class="mx-auto rounded h-24 invert shadow-lg mb-4" />
            </section>

            <section class="text-left mb-8">
                <h3 class="text-xl font-semibold text-[#384e1d]">About the Project</h3>
                <p class="text-gray-600 mt-4">
                    Rootly started in the 2025 <a class="text-blue-500" href="https://brapi.org/">BrAPI</a>
                    Sabbatical program which was based in Cornell University, Ithaca, NY. The project is maintained by
                    <a class="text-blue-500" href="https://ardeea.org/">Ardeea Landscape Research</a>.
                </p>
            </section>

            <section class="text-left mb-8">
                <h3 class="text-xl font-semibold text-[#384e1d]">Project Members</h3>
                <ul class="list-disc list-inside text-gray-600 mt-4">
                    <li><span class="font-semibold">Lead:</span> Omar Tesdell, PhD and Brandon Schlautman, PhD.</li>
                    <li><span class="font-semibold">Supervision:</span> Peter Selby</li>
                    <li><span class="font-semibold">Development & Design:</span> Othman Ali</li>

                </ul>
            </section>

            <section class="text-left">
                <h3 class="text-xl font-semibold text-[#384e1d]">Find the Project on GitHub</h3>
                <p class="text-gray-600 mt-4">
                    Check out the GitHub repo for more information, documentation, and to contribute to the project!
                </p>
                <a href="https://github.com/Othmanali02/Rootly" target="_blank"
                    class="mt-4 text-blue-600 font-bold">Frontend Code</a>
                <br>
                <a href="https://github.com/Othmanali02/RootlyBackend" target="_blank"
                    class="mt-4 text-blue-600 font-bold">Backend Code</a>
            </section>
        </div>
    </div>
</template>


<style scoped>
/* You can add custom styles here if needed */
</style>
