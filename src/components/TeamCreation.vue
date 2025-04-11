<script setup>
import { useToast } from "vue-toastification";
import apiService from "@/services/apiRoutes";
</script>

<script>
const toast = useToast();

export default {
    props: ['user'],
    name: "TeamCreation",
    data() {
        return {
            teamName: "",
            teamDescription: "",
            memberEmail: "",
            invitedMembers: [],
            userLists: [],
            searchQuery: "",
            listLoading: false,
            chosenLists: [],
            filteredLists: [],
            creatingTeam: false,
        };
    },
    async mounted() {
        try {
            if (!this.$props.user) {
                window.location.href = "/";
            }


            this.listLoading = true;
            console.log("mounted");
            const response = await apiService.getUserLists(this.$props.user.email);

            this.userLists = response.data;

            this.filteredLists = this.userLists;
            this.listLoading = false;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    computed: {
        filteredItems() {
            return this.filteredLists.filter(item =>
                item.Name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
    methods: {
        async inviteMember() {

            let message = this.memberEmail + " is added to the team.";
            this.invitedMembers.push(this.memberEmail);
            this.memberEmail = "";
            toast.success(message, {
                timeout: 4000
            });

        },
        removeItem(member) {
            this.invitedMembers = this.invitedMembers.filter(item => item !== member);

        },
        addList(list) {
            console.log(list.Name);
            this.chosenLists.push(list);
            const index = this.filteredLists.indexOf(list);
            console.log(index);
            if (index !== -1) {
                this.filteredLists.splice(index, 1);
            }
            console.log(this.filteredLists);
        },
        removeList(list) {
            this.filteredLists.push(list);
            this.chosenLists = this.chosenLists.filter(item => item !== list);
        },
        async createTeam() {
            try {
                if (!this.teamName.trim()) {
                    toast.error("Team name is required.");
                    return;
                }

                // if (!this.teamDescription.trim()) {
                //     toast.error("Team description is required.");
                //     return;
                // }

                if (!this.invitedMembers.length) {
                    toast.error("Please invite at least one member.");
                    return;
                }

                if (!this.chosenLists.length) {
                    toast.error("Please choose at least one list.");
                    return;
                }


                this.creatingTeam = true;
                const response = await apiService.createTeam(this.invitedMembers, this.chosenLists, this.teamName, this.teamDescription, this.$props.user.UUID);

                this.teamName = "";
                this.teamDescription = "";
                this.memberEmail = "";
                this.invitedMembers = [];
                this.userLists = [];
                this.searchQuery = "";
                this.chosenLists = [];
                this.filteredLists = [];
                let teamID = response.data.id;

                localStorage.setItem("teamCreated", this.teamName);
                this.creatingTeam = false;
                window.location.href = "/teams/" + teamID;
            } catch (error) {
                toast.error("Encountered an error, try again.", {
                    timeout: 4000
                });
                console.error('Error fetching data:', error);
            }
        }

    }
};
</script>


<template>
    <div class="min-h-screen flex items-start justify-start p-6">
        <div class="w-full max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold text-left text-gray-900">Create Team</h1>

            <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-700">Team Name:</h2>
                <input v-model="teamName" type="text"
                    class="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter team name" />
            </div>

            <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-700">Team Description:</h2>
                <textarea v-model="teamDescription" type=""
                    class="mt-2 resize-none h-32 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter team description"></textarea>
            </div>

            <div class="mt-6">
                <h2 class="text-xl font-semibold text-gray-700">Invite Member:</h2>
                <div class="mt-2 flex items-center border border-gray-300 rounded-md">
                    <input type="email" v-model="memberEmail"
                        class="p-3 w-full border-none focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address" />
                    <button @click="inviteMember"
                        class="px-6 py-3 w-24 bg-blue-500 text-white font-bold rounded-r-md hover:bg-blue-700 focus:outline-none">
                        Invite
                    </button>
                </div>
            </div>

            <h4 class="text-xl font-semibold text-left text-gray-700 my-4">Invited Members</h4>

            <div class="bg-gray-200 p-6 rounded-lg shadow-md mb-6 w-full flex flex-wrap gap-4 justify-start">
                <div v-if="invitedMembers.length < 1">
                    <p class="text-gray-600">No members invited yet...</p>
                </div>
                <div v-else class="flex items-center bg-gray-300 p-4 rounded-lg space-x-4"
                    v-for="(member, index) in invitedMembers" :key="index">


                    <span class="text-sm text-gray-900">{{ member }}</span>
                    <button @click="removeItem(member)" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-check-circle text-black">X</i>
                    </button>

                </div>
            </div>


            <div class="mt-6">
                <h2 class="text-xl font-semibold text-gray-700">Add List:</h2>
                <div class="mt-2 flex items-center border border-gray-300 rounded-md">
                    <input v-model="searchQuery" id="add-list" type="text"
                        class="p-3 w-full border-none focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Search for lists to add" />

                </div>
            </div>



            <div class=" rounded-lg shadow-md mb-6 my-4">
                <h3 class="text-xl font-semibold text-gray-700">My lists:</h3>
                <div class="w-full bg-gray-200 p-6 my-4" v-if="listLoading">
                    <img src="../assets/rootlygif.gif" class="mx-auto h-24" alt="loading" />
                </div>

                <div v-else>

                    <div v-if="filteredItems.length < 1">
                        <p class="text-gray-600 my-4">No lists found...</p>
                    </div>
                    <table v-else class="mt-2 w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="py-2 px-4 text-left text-gray-700">List Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="cursor-pointer" v-for="(item, index) in filteredItems" :key="index"
                                @click="addList(item)">
                                <td class="py-2 px-4 border-b border-gray-200">{{ item.Name }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h4 class="text-xl font-semibold text-left text-gray-700 my-4">Chosen Lists</h4>

            <div class="bg-gray-200 p-6 rounded-lg shadow-md mb-6 w-full flex flex-wrap gap-4 justify-start">
                <div v-if="chosenLists.length < 1">
                    <p class="text-gray-600">No lists chosen yet...</p>
                </div>
                <div v-else class="flex items-center bg-gray-300 p-4 rounded-lg space-x-4"
                    v-for="(list, index) in chosenLists" :key="index">
                    <span class="text-sm text-gray-900">{{ list.Name }}</span>
                    <button @click="removeList(list)" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-check-circle text-black">X</i>
                    </button>

                </div>
            </div>

            <div class="mt-8">
                <button @click="createTeam()"
                    class="w-full px-6 py-3 bg-[#384e1d] text-white text-xl font-bold rounded-md focus:outline-none">
                    Create Team
                    <svg v-if="creatingTeam"
                        class="animate-spin inline h-5 w-5 mr-2 border-4 border-white border-t-transparent rounded-full"
                        viewBox="0 0 24 24"></svg>
                </button>
            </div>
        </div>
    </div>
</template>


<style scoped></style>
