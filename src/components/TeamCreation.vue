<script setup>

</script>

<script>

export default {
    props: ['user'],
    data() {
        return {

        };
    },
    async mounted() {
        try {
            console.log("mounted")

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {

    }
};
</script>


<template>
    <div class="min-h-screen flex flex-col items-center justify-start p-6">
        <div class="mx-auto w-1/2">
            <h1 class="text-3xl md:text-4xl font-bold text-black w-full text-left">Create Team</h1>

            <div class="mt-6 w-full flex flex-col items-center">
                <h3 class="text-xl text-left font-semibold text-gray-700">Team Name:</h3>
                <input id="team-name" type="text"
                    class="mt-2 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter team name">
            </div>

            <div class="mt-6 w-full flex items-center justify-between">
                <div class="flex flex-col w-3/4">
                    <label for="invite-member" class="text-xl font-semibold text-gray-700">Invite Member:</label>
                    <input id="invite-member" type="email"
                        class="mt-2 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address">
                        
                </div>
                <button
                    class="ml-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none">
                    Invite
                </button>

               
            </div>
        </div>

    </div>
</template>

<style scoped></style>
