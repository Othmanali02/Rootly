<script setup>
import axios from 'axios';
import { useToast } from "vue-toastification";


</script>

<script>
const toast = useToast();

export default {
    props: ['user', 'teamId'],
    data() {
        return {
            listsInformation: [],
            teamInfo: "",
            invitedEmail: "",
            loading: false,
            isModalOpen: false,
            isInviteOpen: false,
            selectedItem: null,
            scaleExists: false,
            teamLeader: null,
            teamMembers: []
        };
    },
    async mounted() {
        try {

            if (localStorage.getItem("teamCreated")) {
                let teamName = localStorage.getItem("teamCreated");
                let message = teamName + " has been created!";
                toast.success(message, {
                    timeout: 4000
                });
                localStorage.removeItem("teamCreated");
            }

            this.loading = true;
            const response = await axios.post(`http://localhost:3000/rootly/teams/getTeamInfo`, {
                teamId: this.teamId
            });
            console.log(response.data);

            this.listsInformation = response.data.lists;
            this.teamInfo = response.data.teamInfo;
            this.teamLeader = response.data.owner.Name;
            this.teamMembers = response.data.members;

            this.loading = false;


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        handleRowClick(item) {
            const genLocation = "/lists/" + item.listId;
            window.location.href = genLocation;
            // this.selectedItem = item;
            // this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
            this.selectedItem = null;
        },
        handleInviteClick() {
            this.isInviteOpen = true;
        },
        closeInvite() {
            this.isInviteOpen = false;
        },
        checkIfScaleExists(selectedItem) {
            let details = selectedItem.scale;
            if (details === undefined) {
                return false;
            } else {
                return true;
            }
        },
        async inviteMember() {
            try {
                const response = await axios.patch(`http://localhost:3000/rootly/teams/addMember`, {
                    teamId: this.teamInfo.id,
                    memberEmail: this.invitedEmail,
                    teamMembers: this.teamInfo["User ID"]
                });

                console.log(response);

                let message = "List shared with " + response.data.userObj.Name;
                toast.success(message, {
                    timeout: 4000
                });
                this.teamMembers.push(response.data.userObj);
                this.isInviteOpen = false;
            } catch (error) {
                toast.error("Something went wrong", {
                    timeout: 4000
                });
                console.log(error);
            }


        },
        async kickMember(index, memberID) {
            console.log(memberID);
            console.log(this.teamInfo.id);
            if (confirm(`Are you sure you want to remove ${this.teamMembers[index].Name}?`)) {
                try {
                    await axios.patch(`http://localhost:3000/rootly/teams/removeMember`, {
                        teamId: this.teamInfo.id,
                        memberID: memberID,
                        teamMembers: this.teamInfo["User ID"]
                    });

                    let message = this.teamMembers[index].Name + " is now gone forever you can only undo this with a human sacrifice. ";
                    toast.success(message, {
                        timeout: 4000
                    });
                    this.teamMembers.splice(index, 1);
                } catch (error) {
                    toast.error("Something went wrong", {
                        timeout: 4000
                    });
                    console.log(error);
                }


            }
        }
    },
    name: 'TeamDetails',
};
</script>


<template>
    <div class="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">

        <div class="w-full max-w-2xl  text-left dashItems bg-gray-200 p-6 rounded-lg shadow-lg">


            <h2 class="text-xl text-left font-semibold text-gray-900 mb-4">{{ this.teamInfo.Name }}</h2>

            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4">Team Lists</h2>

            <div v-if="loading">
                <img src="../assets/rootlygif.gif" alt="Loading" class="h-96 mx-auto" />
            </div>

            <div v-else class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <table class="w-full table-auto text-left">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="px-4 py-2 text-gray-600 font-medium">List Name</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Length</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Owner</th>

                        </tr>
                    </thead>
                    <tbody class="rounded-lg overflow-y-auto">
                        <tr v-for="(item, index) in listsInformation" :key="index"
                            class="hover:bg-gray-200 transition-all duration-300 border-b border-gray-300 cursor-pointer"
                            @click="handleRowClick(item)">
                            <td class="px-4 py-2 text-gray-700">{{ item.listName }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.length }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.owner }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="isModalOpen"
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                <div class="bg-white p-6  h-[750px]  overflow-y-auto rounded-lg shadow-xl w-1/2">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ selectedItem.trait.traitName }} Details
                        </h2>
                        <button class="px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                            @click="closeModal">
                            Close
                        </button>
                    </div>


                    <!-- 
                    <p><strong>Crop:</strong> {{ selectedItem.crop }}</p>
                    <p><strong>Institution:</strong> {{ selectedItem.institution }}</p>
                    <p><strong>Observation Variable:</strong> {{ selectedItem.observationVariableName }}</p>
                    <p><strong>Trait Name:</strong> {{ selectedItem.trait.traitName }}</p>
                    <p><strong>Details:</strong> {{ selectedItem.details }}</p> -->

                    <section>
                        <h2>Variable Details</h2>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Crop
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.crop }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Variable Name
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.observationVariableName }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Growth Stage
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.growthStage }}
                            </div>
                        </div>

                        <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Trait</h4>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Trait Name
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.trait.traitName }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Trait Class
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.trait.traitClass }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Description
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.trait.description }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Main Abbreviation
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.trait.mainAbbreviation }}

                            </div>
                        </div>

                        <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Method</h4>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Method Name
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.method.methodName }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Method Class
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.method.methodClass }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Description
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.method.description }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Formula
                            </div>
                            <div class="w-2/3 p-3 bg-white">
                                {{ selectedItem.method.formula }}

                            </div>
                        </div>

                        <div v-if="checkIfScaleExists(selectedItem)">
                            <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Scale</h4>
                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Scale Name
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    {{ selectedItem.scale.scaleName }}
                                </div>
                            </div>
                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Data Type
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    {{ selectedItem.scale.dataType }}
                                </div>
                            </div>
                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Categories
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    {{ selectedItem.scale.categories }}
                                </div>
                            </div>


                        </div>

                    </section>



                </div>
            </div>



            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4 my-4">Team Members</h2>

            <div class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <table class="min-w-full table-auto">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="px-4 py-2 text-left">Name</th>
                            <th class="px-4 py-2 text-left">Email</th>
                            <th class="px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="teamMembers.length === 0">
                            <td colspan="3" class="px-4 py-2 text-center text-gray-500">
                                No Members in this team.. pretty lonely in here ngl
                            </td>
                        </tr>

                        <tr v-for="(member, index) in teamMembers" :key="index" class="border-b">
                            <td class="px-4 py-2">{{ member.Name }}</td>
                            <td class="px-4 py-2">{{ member.Email }}</td>
                            <td class="px-4 py-2 text-center">
                                <button @click="kickMember(index, member['User ID'])"
                                    class="bg-red-500 font-semibold text-xs text-white px-3 py-2 rounded-lg hover:bg-red-600">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4 my-4">Team Leader</h2>

            <div class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <h3>{{ this.teamLeader }}</h3>
            </div>

            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4 my-4">Invite Members</h2>

            <div class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <button @click="handleInviteClick"
                    class="bg-blue-500 p-3 text-white font-semibold rounded-lg cursor-pointer">
                    Invite team by email <img class="inline h-5 invert" src="../assets/plus.png" alt="+" />

                </button>
            </div>

            <div v-if="isInviteOpen"
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex  justify-center items-center z-50">
                <div class="bg-white p-8 h-96 overflow-y-auto rounded-lg shadow-xl  w-1/2">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-semibold text-gray-800">Invite Workspace Members</h2>
                        <button class="px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                            @click="closeInvite">
                            Close
                        </button>
                    </div>

                    <hr class="my-4 border-gray-300">

                    <div class="mt-6">
                        <div class="flex items-center space-x-4">
                            <label for="email" class="text-lg text-gray-700">Invite by Email</label>
                            <input id="email" type="email" v-model="invitedEmail"
                                class="border-2 border-gray-300 rounded-lg px-4 py-2 w-2/3 focus:outline-none focus:border-blue-500"
                                placeholder="Enter email address">
                            <button @click="inviteMember"
                                class="px-6 py-2 font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                                Invite
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<style scoped>
.dashItems {
    max-width: 60%;
    padding: 1.5rem;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 0.75rem;
}

th {
    background-color: #f3f4f6;
}

tr:hover {
    background-color: #f1f5f9;
}
</style>