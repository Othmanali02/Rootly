<script setup>
import apiService from '@/services/apiRoutes';
import { useToast } from "vue-toastification";


</script>

<script>
const toast = useToast();

export default {
    props: ['user', 'teamId'],
    data() {
        return {
            listsInformation: [],
            teamInfo: {},
            invitedEmail: "",
            loading: false,
            isModalOpen: false,
            isInviteOpen: false,
            selectedItem: null,
            scaleExists: false,
            teamLeader: null,
            teamMembers: [],
            isOwner: false,
            isMember: false,
            isVariablesOpen: false,
            listLoading: false,
            searchQuery: "",
            userLists: [],
            chosenLists: []
        };
    },
    computed: {
        filteredItems() {
            return this.userLists.filter(item => {
                const isInListsInformation = this.listsInformation.some(info => info.listId === item.id || info.listId === item["List ID"]);
                return item.Name.toLowerCase().includes(this.searchQuery.toLowerCase()) && !isInListsInformation;
            });
        }

    },
    async mounted() {
        try {
            const teamResponse = await apiService.teamStatus(this.teamId);

            this.isOwner = teamResponse.data.isOwner;
            this.isMember = teamResponse.data.isMember;

            if (localStorage.getItem("teamCreated")) {
                let teamName = localStorage.getItem("teamCreated");
                let message = teamName + " has been created!";
                toast.success(message, {
                    timeout: 4000
                });
                localStorage.removeItem("teamCreated");
            }

            this.loading = true;
            const response = await apiService.getTeamInfo(this.teamId);
            console.log(response.data);
            this.listsInformation = response.data.lists;
            console.log(this.listsInformation);

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
            const genLocation = "/lists/" + item.listBaserowId;
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
                console.log(this.teamInfo);
                const response = await apiService.addMember(this.teamInfo.id, this.invitedEmail, this.teamInfo["User ID"]);


                this.teamInfo["User ID"] = response.data.newMembers;

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
            if (confirm(`Are you sure you want to remove ${this.teamMembers[index].Name}?`)) {
                try {
                    console.log(this.teamMembers);
                    const response = await apiService.removeMember(this.teamInfo.id, memberID, this.teamInfo["User ID"]);

                    this.teamInfo["User ID"] = response.data.newMembers;

                    let message = this.teamMembers[index].Name + " has been removed from this team.";
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
        },
        async handleRemoveClick(list, event) {
            try {
                event.stopPropagation();

                console.log(list);
                console.log(this.teamInfo.id);
                const response = await apiService.removeList(list.listId, this.teamInfo.id, list.baserowID, this.teamInfo.Lists);
                console.log(response.data);
                toast.success("List Removed", {
                    timeout: 4000
                });

                let id = list.listId;

                const index = this.listsInformation.findIndex(item => item.listId === id);
                if (index !== -1) {
                    this.listsInformation.splice(index, 1);
                }

            } catch (error) {
                console.log(error);
            }
        },
        async handleVariableClick() {
            this.isVariablesOpen = true;
            this.listLoading = true;

            const response = await apiService.getUserLists(this.$props.user.email);
            console.log(response.data);
            this.userLists = response.data;
            console.log(this.userLists);

            this.listLoading = false;
        },
        closeVariable() {
            this.isVariablesOpen = false;
        },
        addList(list) {
            console.log(list.Name);
            this.chosenLists.push(list);
            const index = this.userLists.indexOf(list);
            console.log(index);
            if (index !== -1) {
                this.userLists.splice(index, 1);
            }
            console.log(this.userLists);
        },
        removeList(list) {
            this.userLists.push(list);
            this.chosenLists = this.chosenLists.filter(item => item !== list);
        },
        async handleNewLists() {
            try {
                console.log(this.chosenLists)
                const response = await apiService.addLists(this.teamInfo.id, this.chosenLists);
                console.log(response.data);

                this.isVariablesOpen = false;
                toast.success("Lists Added", {
                    timeout: 4000
                });

                // listId
                // <td class="px-4 py-2 text-gray-700">{{ item.listName }}</td>
                // <td class="px-4 py-2 text-gray-700">{{ item.length }}</td>
                // <td class="px-4 py-2 text-gray-700">{{ item.owner }}</td>


                for (let i = 0; i < this.chosenLists.length; i++) {
                    this.listsInformation.push({
                        listId: this.chosenLists[i].id,
                        listName: this.chosenLists[i].Name,
                        length: this.chosenLists[i].Length,
                        owner: this.chosenLists[i].Owner[0].email
                    });
                }

                this.chosenLists = [];
            } catch (error) {
                toast.success("Something went wrong", {
                    timeout: 4000
                });
                console.log(error);
            }
        }

    },
    name: 'TeamDetails',
};
</script>


<template>
    <div class="min-h-screen items-center justify-start p-6 bg-gray-50">

        <div class="w-full max-w-2xl text-left dashItems bg-gray-200 p-6 rounded-lg shadow-lg">

            <h2 class="text-xl text-left font-semibold text-gray-900 mb-4">{{ this.teamInfo.Name }}</h2>

            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4">Team Lists</h2>

            <div v-if="loading">
                <img src="../assets/rootlygif.gif" alt="Loading" class="h-48 sm:h-64 md:h-96 mx-auto" />
            </div>

            <div v-else class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <table class="w-full table-auto text-left">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="px-4 py-2 text-gray-600 font-medium">List Name</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Length</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Owner</th>
                            <th v-if="this.isOwner" class="px-4 py-2 text-gray-600 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody class="rounded-lg overflow-y-auto">
                        <tr v-if="listsInformation.length === 0">
                            <td colspan="5" class="px-4 py-2 text-center text-gray-500">
                                No lists yet..
                            </td>
                        </tr>
                        <tr v-for="(item, index) in listsInformation" :key="index"
                            class="hover:bg-gray-200 transition-all duration-300 border-b border-gray-300 cursor-pointer"
                            @click="handleRowClick(item)">
                            <td class="px-4 py-2 text-gray-700">{{ item.listName }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.length }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.owner }}</td>

                            <td v-if="this.isOwner" class="px-4 py-2 text-center">
                                <button @click="handleRemoveClick(item, $event)"
                                    class="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="this.isOwner" class="mt-4 flex justify-center">
                    <button @click="handleVariableClick()"
                        class="px-6 py-3 bg-[#384e1d] w-full text-white font-semibold rounded-lg shadow-md hover:bg-[#2b3c17] transition duration-300">
                        Add List
                    </button>
                </div>
            </div>

            <div v-if="isVariablesOpen"
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                <div class="bg-white p-6 h-[750px] overflow-y-auto rounded-lg shadow-xl sm:w-1/2 w-full">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">Add List</h2>
                        <button class="px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                            @click="closeVariable">
                            Close
                        </button>
                    </div>

                    <div class="rounded-lg shadow-md mb-6 my-4">
                        <div class="mt-6">
                            <div class="mt-2 flex items-center border border-gray-300 rounded-md">
                                <input v-model="searchQuery" id="add-list" type="text"
                                    class="p-3 w-full border-none focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search for variables to add" />
                            </div>
                        </div>

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

                    <button @click="handleNewLists()"
                        class="text-center my-3 cursor-pointer bg-blue-500 text-white font-semibold p-6 rounded-lg shadow-md mb-6 w-full">
                        Add List
                    </button>

                </div>
            </div>

            <div v-if="this.isOwner">
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
                                    No Members in this team..
                                </td>
                            </tr>

                            <tr v-for="(member, index) in teamMembers" :key="index" class="border-b">
                                <td class="px-4 py-2">{{ member.Name }}</td>
                                <td class="px-4 py-2">{{ member.Email }}</td>
                                <td class="px-4 py-2 text-center">
                                    <button @click="kickMember(index, member.id)"
                                        class="bg-red-500 font-semibold text-xs text-white px-3 py-2 rounded-lg hover:bg-red-600">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4 my-4">Team Leader</h2>

            <div class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <h3>{{ this.teamLeader }}</h3>
            </div>

            <div v-if="this.isOwner">
                <h2 class="text-xl text-left font-semibold text-gray-700 mb-4 my-4">Invite Members</h2>

                <div class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                    <button @click="handleInviteClick"
                        class="bg-blue-500 p-3 text-white font-semibold rounded-lg cursor-pointer">
                        Invite team by email <img class="inline h-5 invert" src="../assets/plus.png" alt="+" />
                    </button>
                </div>
            </div>

            <div v-if="isInviteOpen"
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                <div class="bg-white p-8 h-96 overflow-y-auto rounded-lg shadow-xl sm:w-1/2 w-full">
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
    max-width: 90%;
    padding: 1.5rem;
    margin: auto;
}

@media (max-width: 1024px) {
    .dashItems {
        max-width: 80%;
    }
}

@media (max-width: 768px) {
    .dashItems {
        max-width: 90%;
    }
}

@media (max-width: 640px) {
    .dashItems {
        max-width: 100%;
    }
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
    font-weight: bold;
}

tr:hover {
    background-color: #f1f5f9;
}

/* Adjusting buttons and form elements for smaller screens */
button {
    padding: 0.75rem 1.5rem;
}

input[type="text"],
input[type="email"] {
    padding: 0.75rem;
    width: 100%;
    margin-top: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #ccc;
}

@media (max-width: 640px) {

    /* Small screen adjustments for buttons and input fields */
    button {
        width: 100%;
        /* Make buttons full width on small screens */
        padding: 1rem;
    }
}
</style>
