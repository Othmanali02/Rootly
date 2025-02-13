<script setup>
import axios from 'axios';
</script>

<script>
export default {
    props: ['user', 'listId'],
    data() {
        return {
            listInformation: [],
            listName: "",
            loading: false,
            isModalOpen: false,
            selectedItem: null,
            scaleExists: false
        };
    },
    async mounted() {
        try {
            this.loading = true;
            console.log(this.$props.user.email);
            const response = await axios.post(`http://localhost:3000/getListInfo`, {
                listId: this.listId
            });
            this.listInformation = response.data.items;
            this.listName = response.data.listName;
            console.log(response.data);
            this.loading = false;

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        handleRowClick(item) {
            this.selectedItem = item;
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
            this.selectedItem = null;
        },
        checkIfScaleExists(selectedItem) {
            let details = selectedItem.scale;
            if (details === undefined) {
                return false;
            } else {
                return true;
            }
        }
    },
    name: 'ListView',
};
</script>


<template>
    <div class="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">

        <div class="w-full max-w-2xl  text-left dashItems bg-gray-200 p-6 rounded-lg shadow-lg">


            <h2 class="text-xl text-left font-semibold text-gray-900 mb-4">{{ this.listName }}</h2>

            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4">List Information</h2>

            <div v-if="loading">
                <img src="../assets/rootlygif.gif" alt="Loading" class="h-96 mx-auto" />
            </div>

            <div v-else class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <table class="w-full table-auto text-left">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="px-4 py-2 text-gray-600 font-medium">Crop</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Institution</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Observation Variable</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Trait Name</th>
                        </tr>
                    </thead>
                    <tbody class="rounded-lg overflow-y-auto">
                        <tr v-for="(item, index) in listInformation" :key="index"
                            class="hover:bg-gray-200 transition-all duration-300 border-b border-gray-300 cursor-pointer"
                            @click="handleRowClick(item)">
                            <td class="px-4 py-2 text-gray-700">{{ item.crop }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.institution }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.observationVariableName }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.trait.traitName }}</td>
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


            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4 my-4">Sharing details</h2>

            <div class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <h1>Team 1</h1>
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