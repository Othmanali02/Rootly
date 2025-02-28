<script setup>
import apiService from '@/services/apiRoutes';
import axios from 'axios';
import { ref } from 'vue';
import { useToast } from "vue-toastification";


</script>

<script>
const items = ref([]);
const toast = useToast();

export default {
    props: ['user', 'listId'],
    data() {
        return {
            listInformation: [],
            listName: "",
            listBrowID: "",
            invitedEmail: "",
            loading: false,
            isModalOpen: false,
            isInviteOpen: false,
            isVariablesOpen: false,
            selectedItem: null,
            scaleExists: false,
            isOwner: false,
            isMember: false,
            selectedOntology: [],
            selectedOntologySelected: null,
            selectedDetails: [],
            selectedTerm: null,
            selectedOntologyDbId: null,
            selectedTraits: [],
            selectedVariable: null,
            selectedVariableDetails: [],
            fetchTermDetails: false,
            fetchVariableDetails: false,
            selectedBar: 1,
            customVariables: [],
            inputValue: {
                crop: '',
                observationVariableName: '',
                growthStage: '',
                defaultValue: "",
                institution: "Rootly",
                trait: {
                    traitName: '',
                    traitClass: '',
                    description: '',
                    mainAbbreviation: '',
                },
                method: {
                    methodName: '',
                    methodClass: '',
                    description: '',
                    formula: '',
                },
                scale: {
                    scaleName: '',
                    dataType: '',
                    validValues: {
                        categories: []
                    },
                }
            },
            listLoading: false,
            myCustomVariables: [],
            chosenLists: [],
            searchQuery: ""

        };
    },
    async mounted() {
        try {
            console.log("Mounted");
            const listStatus = await apiService.listStatus(this.listId);

            this.isOwner = listStatus.data.isOwner;
            this.isMember = listStatus.data.isMember;


            if (localStorage.getItem("listCreated")) {
                let listname = localStorage.getItem("listCreated");
                let message = listname + " has been created!";
                toast.success(message, {
                    timeout: 4000
                });
                localStorage.removeItem("listCreated");
            }

            console.log(this.listId);

            this.loading = true;
            console.log(this.$props.user.email);

            const response = await apiService.getListInfo(this.listId);

            this.listInformation = response.data.items;
            this.listName = response.data.listName;
            this.listBrowID = response.data.listBrowID;
            console.log(response.data.customVariables);

            if (response.data.customVariables.length >= 1) {
                for (let i = 0; i < response.data.customVariables.length; i++) {
                    this.customVariables.push({ cropOntologyData: JSON.parse(response.data.customVariables[i].cropOntologyData), baserowID: response.data.customVariables[i].baserowID });
                }
            }
            console.log(this.customVariables);
            this.loading = false;


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    computed: {
        filteredItems() {

            return this.myCustomVariables.filter(item =>
                item.observationVariableName.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
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
        addList(list) {
            console.log(list.Name);
            this.chosenLists.push(list);
            const index = this.myCustomVariables.indexOf(list);
            console.log(index);
            if (index !== -1) {
                this.myCustomVariables.splice(index, 1);
            }
            console.log(this.myCustomVariables);
        },
        removeList(list) {
            this.myCustomVariables.push(list);
            this.chosenLists = this.chosenLists.filter(item => item !== list);
        },
        async generateFieldBookFile() {

            try {
                toast.info("Generating the FieldBook File", {
                    timeout: 4000
                });
                let finalArr = [...this.listInformation];
                this.customVariables.forEach(variable => {
                    finalArr.push(variable);
                });

                const response = await axios.post('/api/rootly/lists/create-csv', {
                    listData: finalArr,
                    listName: this.listName
                }, { responseType: 'blob' });

                console.log('CSV Created:', response.data);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'FieldBook.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (error) {
                console.error('Error creating CSV:', error);
            }

        },
        async generateGridscoreTsv() {

            try {
                toast.info("Generating the Gridscore TSV file", {
                    timeout: 4000
                });

                let finalArr = [...this.listInformation];
                this.customVariables.forEach(variable => {
                    finalArr.push(variable);
                });

                const response = await axios.post('/api/rootly/lists/create-tsv-gridscore', {
                    listData: finalArr,
                    listName: this.listName
                }, { responseType: 'blob' });

                console.log('TSV Created:', response.data);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Gridscore-tsv.tsv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (error) {
                console.error('Error creating CSV:', error);
            }

        },
        async generateGridscoreJSON() {
            try {
                toast.info("Generating the Gridscore JSON file", {
                    timeout: 4000
                });
                let finalArr = [...this.listInformation];
                this.customVariables.forEach(variable => {
                    finalArr.push(variable);
                });

                const response = await axios.post('/api/rootly/lists/create-json-gridscore', {
                    listData: finalArr,
                    listName: this.listName
                }, { responseType: 'blob' });

                console.log('TSV Created:', response.data);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Gridscore-JSON.json');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (error) {
                console.error('Error creating CSV:', error);
            }

        },
        async inviteMember() {
            try {

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
        async handleVariableClick() {
            const response = await axios.get('/api/rootly/cropontology/getOntologies');
            items.value = response.data.results[0];

            this.isVariablesOpen = true;
            this.listLoading = true;
            const response1 = await apiService.getUserCustomVariables();
            console.log(response1.data);
            for (let i = 0; i < response1.data.customVariables.length; i++) {
                let parsedVariable = JSON.parse(response1.data.customVariables[i]);

                let existsInCustomVariables = this.customVariables.some(variable => {
                    return variable.cropOntologyData.trait.traitName === parsedVariable.trait.traitName;
                });

                if (!existsInCustomVariables) {
                    this.myCustomVariables.push(parsedVariable);
                }
            }
            this.listLoading = false;
        },
        closeVariable() {
            this.isVariablesOpen = false;
        },
        async handleNewVariable() {
            try {
                console.log(this.listBrowID);
                const response = await apiService.addVariable(this.listId, this.listBrowID, this.listName, this.selectedTraits);

                console.log(response);

                this.isVariablesOpen = false;
                toast.success("Variables Added", {
                    timeout: 4000
                });
                for (let i = 0; i < this.selectedTraits.length; i++) {
                    this.listInformation.push({ cropOntologyData: this.selectedTraits[i], baserowID: response.data.baserowID });
                }
            } catch (error) {
                console.log(error);
            }
        },
        selectItem(item) {
            if (this.selectedTerm === item.ontologyName) {
                this.selectedTerm = null;
                this.selectedOntologyDbId = null;
                this.selectedOntology = [];
                this.selectedOntologySelected = null;
                this.selectedDetails = [];
                this.selectedVariableDetails = [];

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                this.selectedTerm = item.ontologyName;
                this.selectedOntologyDbId = item.ontologyDbId;
                this.selectedOntology = item.additional_info.term_names;
                this.selectedOntologySelected = null;
                this.selectedDetails = [];
                this.selectedVariableDetails = [];

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        async selectOntology(ontology) {
            this.selectedDetails = null;
            this.selectedOntologySelected = ontology;
            this.fetchTermDetails = true;
            try {
                const response = await axios.get(`/api/rootly/cropontology/getVariables?ontologyDbID=${this.selectedOntologyDbId}&traitClass=${ontology}`);
                this.selectedDetails = response.data.result;
                this.fetchTermDetails = false;

            } catch (error) {
                console.error('Error fetching data:', error);
            }

        },
        async selectVariable(variable) {
            this.selectedVariableDetails = null;
            this.fetchVariableDetails = true;
            try {
                const response = await axios.get(`/api/rootly/cropontology/getVariable?observationVariableDbId=${variable}`);
                console.log(response.data.result);
                this.selectedVariableDetails = response.data.result;
                this.fetchVariableDetails = false;

            } catch (error) {
                console.error('Error fetching data:', error);
            }


        },
        async handleRemoveClick(list, event) {
            event.stopPropagation();
            try {
                console.log(list);
                const response = await apiService.removeVariable(this.listId, this.listBrowID, list.baserowID);
                console.log(response.data);
                toast.success("Variable Removed", {
                    timeout: 4000
                });

                if (list.cropOntologyData.observationVariableDbId) {
                    let id = list.cropOntologyData.observationVariableDbId;

                    const index = this.listInformation.findIndex(item => item.cropOntologyData.observationVariableDbId === id);
                    if (index !== -1) {
                        this.listInformation.splice(index, 1);
                    }
                } else {
                    let name = list.cropOntologyData.observationVariableName;

                    const index = this.customVariables.findIndex(item => item.cropOntologyData.observationVariableName === name);
                    if (index !== -1) {
                        this.customVariables.splice(index, 1);
                    }
                }

            } catch (error) {
                console.log(error);
            }
        },
        async addCustomVariable() {
            try {

                const response = await apiService.addCustomVariable(this.listId, this.listBrowID, this.listName, this.inputValue);
                console.log(response);

                this.isVariablesOpen = false;
                toast.success("Variable Added", {
                    timeout: 4000
                });

                this.customVariables.push({ cropOntologyData: this.inputValue, baserowID: response.data.baserowID });

            } catch (error) {
                console.log(error);
            }
        },
        async handleNewCustomVariables() {
            try {
                const response = await apiService.addMultipleCustomVariables(this.listId, this.listBrowID, this.listName, this.chosenLists);
                console.log(response.data);

                this.isVariablesOpen = false;
                toast.success("Variable Added", {
                    timeout: 4000
                });

                for (let i = 0; i < this.chosenLists.length; i++) {
                    this.customVariables.push({ cropOntologyData: response.data.variables[i].listContentData, baserowID: response.data.variables[i].baserowID });
                }

            } catch (error) {
                console.log(error);
            }
        },
        addCategory() {
            this.inputValue.scale.validValues.categories.push('');
        },
        removeCategory(index) {
            this.inputValue.scale.validValues.categories.splice(index, 1);
        }

    },
    name: 'ListView',
};
</script>


<template>
    <div class="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
        <div class="w-full dashItems bg-gray-200 p-6 rounded-lg shadow-lg">
            <h2 class="text-xl text-left font-semibold text-gray-900 mb-4">{{ this.listName }}</h2>

            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4">List Information</h2>

            <div v-if="loading">
                <img src="../assets/rootlygif.gif" alt="Loading" class="h-48 sm:h-64 md:h-96 mx-auto" />
            </div>


            <div v-else class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <table class="w-full table-auto text-left">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="px-4 py-2 text-gray-600 font-medium">Crop</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Institution</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Observation Variable</th>
                            <th class="px-4 py-2 text-gray-600 font-medium">Trait Name</th>
                            <th v-if="this.isOwner" class="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="rounded-lg overflow-y-auto">
                        <tr v-for="(item, index) in listInformation" :key="index"
                            class="hover:bg-gray-200 transition-all duration-300 border-b border-gray-300 cursor-pointer"
                            @click="handleRowClick(item)">
                            <td class="px-4 py-2 text-gray-700">{{ item.cropOntologyData.crop }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.cropOntologyData.institution }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.cropOntologyData.observationVariableName }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.cropOntologyData.trait.traitName }}</td>

                            <td v-if="this.isOwner" class="px-4 py-2 text-center">
                                <button @click="handleRemoveClick(item, $event)"
                                    class="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-if="this.customVariables.length >= 1">
                        <tr v-for="(item, index) in customVariables" :key="index"
                            class="hover:bg-gray-200 transition-all duration-300 border-b border-gray-300 cursor-pointer"
                            @click="handleRowClick(item)">
                            <td class="px-4 py-2 text-gray-700">{{ item.cropOntologyData.crop }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.cropOntologyData.institution }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.cropOntologyData.observationVariableName }}</td>
                            <td class="px-4 py-2 text-gray-700">{{ item.cropOntologyData.trait.traitName }}</td>

                            <td class="px-4 py-2 text-center">
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
                        Add Variable to list
                    </button>
                </div>
            </div>




            <div v-if="isVariablesOpen"
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                <div
                    class="bg-white p-6 h-[750px] overflow-y-auto rounded-lg shadow-xl sm:w-11/12 md:w-1/2 lg:w-1/3 w-full">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">Add Variable</h2>
                        <button class="px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                            @click="closeVariable">
                            Close
                        </button>
                    </div>

                    <div class="my-4 mx-auto max-w-full">
                        <div class="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button @click="selectedBar = 1" :class="[
                                'px-4 py-2 font-bold flex-1',
                                selectedBar === 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            ]">
                                Crop Ontology
                            </button>

                            <div class="border-l border-gray-300"></div>

                            <button @click="selectedBar = 2" :class="[
                                'px-4 py-2 font-bold flex-1',
                                selectedBar === 2 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            ]">
                                Create Variable
                            </button>

                            <div class="border-l border-gray-300"></div>

                            <button @click="selectedBar = 3" :class="[
                                'px-4 py-2 font-bold flex-1',
                                selectedBar === 3 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            ]">
                                Custom Variables
                            </button>
                        </div>
                    </div>

                    <div v-if="selectedBar === 1">
                        <div
                            class="w-full flex rounded-lg my-4 h-[400px] shadow-md overflow-y-auto border border-gray-300 transition-all duration-300">
                            <div
                                :class="['transition-all duration-300', selectedTerm ? 'w-full sm:w-1/6' : 'w-full sm:w-1/2', 'bg-gray-100']">
                                <ul>
                                    <li class="px-4 py-3 bg-gray-300 border font-bold cursor-pointer sticky top-0 z-10">
                                        Ontology
                                    </li>
                                    <li v-for="(item, index) in items" :key="index" @click="selectItem(item)"
                                        :class="['px-4 py-3 border font-bold cursor-pointer', selectedTerm === item.ontologyName ? 'bg-blue-500 text-white' : '']">
                                        {{ item.ontologyName }}
                                    </li>
                                </ul>
                            </div>

                            <div
                                :class="['transition-all duration-300', selectedTerm ? 'w-full sm:w-1/3' : 'w-full sm:w-1/4', 'bg-white']">
                                <ul>
                                    <li class="text py-3 border px-4 bg-gray-300 font-semibold">Term</li>
                                    <li v-for="(ontology, index) in selectedOntology" :key="index"
                                        @click="selectOntology(ontology)"
                                        :class="['px-4 py-3 border cursor-pointer', selectedOntologySelected === ontology ? 'bg-blue-500 text-white' : '']">
                                        {{ ontology }}
                                    </li>
                                </ul>
                            </div>

                            <div
                                :class="['transition-all duration-300', selectedOntology.length ? 'w-full sm:w-1/2' : 'w-full sm:w-1/5', 'bg-gray-50']">
                                <ul>
                                    <li class="text py-3 border px-4 bg-gray-300 font-semibold">Variables</li>
                                    <div v-if="fetchTermDetails" class="flex justify-center py-4 my-12">
                                        <img class="h-24" src="../assets/rootlygif.gif" alt="Loading" />
                                    </div>
                                    <li v-for="(detail, index) in selectedDetails" :key="index"
                                        class="px-4 py-3 border cursor-pointer capitalize">
                                        <input type="checkbox" v-model="selectedTraits" :value="detail" class="mr-5" />
                                        <div class="inline" @click="selectVariable(detail.observationVariableDbId)">
                                            {{ detail.trait.traitName }}
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div
                                :class="['transition-all duration-300', selectedOntology.length ? 'w-full sm:w-1/2' : 'w-full sm:w-1/4', 'bg-white']">
                                <ul>
                                    <li class="text py-3 border px-4 bg-gray-300 font-semibold">Details</li>

                                    <div v-if="fetchVariableDetails" class="flex justify-center py-4 my-12">
                                        <img class="h-24" src="../assets/rootlygif.gif" alt="Loading" />
                                    </div>
                                    <li v-for="(detail, index) in selectedVariableDetails" :key="index"
                                        class="px-4 py-3 border capitalize">
                                        <span class="font-bold">Variable</span>
                                        <div v-if="detail.observationVariableDbId">{{ detail.observationVariableDbId }}
                                        </div>
                                        <div v-if="detail.observationVariableName">{{ detail.observationVariableName }}
                                        </div>
                                        <div v-if="detail.contextOfUse && detail.contextOfUse[0]">{{
                                            detail.contextOfUse[0] }}</div>
                                        <hr class="my-3">

                                        <span class="font-bold">Trait</span>
                                        <div v-if="detail.trait && detail.trait.traitName">{{ detail.trait.traitName }}
                                        </div>
                                        <div v-if="detail.trait && detail.trait.traitClass">{{ detail.trait.traitClass
                                            }}</div>
                                        <div v-if="detail.trait && detail.trait.description">{{ detail.trait.description
                                            }}</div>
                                        <hr class="my-3">

                                        <span class="font-bold">Method</span>
                                        <div v-if="detail.method && detail.method.methodName">{{
                                            detail.method.methodName }}</div>
                                        <div v-if="detail.method && detail.method.Class">{{ detail.method.Class }}</div>
                                        <div v-if="detail.method && detail.method.description">{{
                                            detail.method.description }}</div>
                                        <hr class="my-3">

                                        <span class="font-bold">Scale</span>
                                        <div v-if="detail.scale && detail.scale.scaleName">{{ detail.scale.scaleName }}
                                        </div>
                                        <div v-if="detail.scale && detail.scale.dataType">{{ detail.scale.dataType }}
                                        </div>
                                        <div
                                            v-if="detail.scale && detail.scale.validValues && detail.scale.validValues.categories">
                                            {{ detail.scale.validValues.categories }}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <h4 class="text-xl font-semibold text-center my-4">Chosen Variables:</h4>

                        <div
                            class="bg-gray-200 p-6 rounded-lg shadow-md mb-6 w-full flex flex-wrap gap-4 justify-start">
                            <div v-for="(trait, index) in selectedTraits" :key="index"
                                class="flex items-center bg-gray-300 p-4 rounded-lg space-x-2">
                                <span class="text-sm text-gray-900">{{ trait.trait.traitName }}</span>
                                <button @click="removeItem(trait)" class="text-red-500 hover:text-red-700">
                                    <i class="fas fa-check-circle text-black">X</i>
                                </button>
                            </div>
                        </div>

                        <button @click="handleNewVariable()"
                            class="text-center my-3 cursor-pointer bg-blue-500 text-white font-semibold p-6 rounded-lg shadow-md mb-6 w-full">
                            Add Variable
                        </button>
                    </div>

                    <div v-if="selectedBar === 2">
                        <section>
                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Crop
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.crop" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Variable Name
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.observationVariableName"
                                        class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Growth Stage
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.growthStage" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Trait</h4>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Trait Name
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.trait.traitName" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Trait Class
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.trait.traitClass" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Description
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.trait.description" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Main Abbreviation
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.trait.mainAbbreviation"
                                        class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Method</h4>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Method Name
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.method.methodName" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Method Class
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.method.methodClass" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Description
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.method.description" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div class="flex border rounded my-2 w-full">
                                <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Formula
                                </div>
                                <div class="w-2/3 p-3 bg-white">
                                    <input v-model="inputValue.method.formula" class="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div>
                                <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Scale</h4>

                                <div class="flex border rounded my-2 w-full">
                                    <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                        Scale Name
                                    </div>
                                    <div class="w-2/3 p-3 bg-white">
                                        <input v-model="inputValue.scale.scaleName" class="w-full p-2 border rounded" />
                                    </div>
                                </div>

                                <div class="flex border rounded my-2 w-full">
                                    <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                        Data Type
                                    </div>
                                    <div class="w-2/3 p-3 bg-white">
                                        <select v-model="inputValue.scale.dataType"
                                            class="w-full p-2 border rounded cursor-pointer">
                                            <option value="" disabled>Select Data Type</option>
                                            <option value="numeric">Numeric</option>
                                            <option value="categorical">Categorical</option>
                                            <option value="percent">Percent</option>
                                            <option value="date">Date</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="text">Text</option>
                                            <option value="photo">Photo</option>
                                            <option value="counter">Counter</option>
                                            <option value="multicat">Multicat</option>
                                            <option value="audio">Audio</option>
                                            <option value="location">Location</option>
                                        </select>
                                    </div>
                                </div>


                                <div class="flex border rounded my-2 w-full">
                                    <div class="w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                        Categories
                                    </div>
                                    <div class="w-2/3 p-3 bg-white">
                                        <div v-for="(category, index) in inputValue.scale.validValues.categories"
                                            :key="index" class="flex items-center space-x-2 mb-2">
                                            <input v-model="inputValue.scale.validValues.categories[index]"
                                                class="w-full p-2 border rounded" placeholder="Category" />
                                            <button @click="removeCategory(index)" class="text-red-500 p-1"
                                                :disabled="inputValue.scale.validValues.categories.length <= 1">
                                                X
                                            </button>
                                        </div>

                                        <button @click="addCategory"
                                            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            Add Category
                                        </button>
                                    </div>
                                </div>


                            </div>

                        </section>
                        <button @click="addCustomVariable()"
                            class="text-center my-3 cursor-pointer bg-blue-500 text-white font-semibold p-6 rounded-lg shadow-md mb-6 w-full">
                            Add Variable
                        </button>
                    </div>

                    <div v-if="selectedBar === 3">
                        <div class=" rounded-lg shadow-md mb-6 my-4">
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
                                    <p class="text-gray-600 my-4">No custom variables found...</p>
                                </div>
                                <table v-else class="mt-2 w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr class="bg-gray-100">
                                            <th class="py-2 px-4 text-left text-gray-700">Variable Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="cursor-pointer" v-for="(item, index) in filteredItems" :key="index"
                                            @click="addList(item)">
                                            <td class="py-2 px-4 border-b border-gray-200">{{
                                                item.observationVariableName }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <h4 class="text-xl font-semibold text-left text-gray-700 my-4">Chosen Lists</h4>

                        <div
                            class="bg-gray-200 p-6 rounded-lg shadow-md mb-6 w-full flex flex-wrap gap-4 justify-start">
                            <div v-if="chosenLists.length < 1">
                                <p class="text-gray-600">No custom variables chosen yet...</p>
                            </div>
                            <div v-else class="flex items-center bg-gray-300 p-4 rounded-lg space-x-4"
                                v-for="(list, index) in chosenLists" :key="index">
                                <span class="text-sm text-gray-900">{{ list.observationVariableName }}</span>
                                <button @click="removeList(list)" class="text-red-500 hover:text-red-700">
                                    <i class="fas fa-check-circle text-black">X</i>
                                </button>

                            </div>
                        </div>

                        <button @click="handleNewCustomVariables()"
                            class="text-center my-3 cursor-pointer bg-blue-500 text-white font-semibold p-6 rounded-lg shadow-md mb-6 w-full">
                            Add Variable
                        </button>

                    </div>

                </div>
            </div>

            <div v-if="isModalOpen"
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                <div
                    class="bg-white p-6 h-[750px] overflow-y-auto rounded-lg shadow-xl sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">{{
                            selectedItem.cropOntologyData.trait.traitName }} Details</h2>
                        <button class="px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                            @click="closeModal">
                            Close
                        </button>
                    </div>

                    <section>
                        <h2 class="text-lg font-semibold">Variable Details</h2>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Crop
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.crop }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Variable Name
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.observationVariableName }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Growth Stage
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.growthStage }}
                            </div>
                        </div>

                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Default Value
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.defaultValue }}
                            </div>
                        </div>

                        <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Trait</h4>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Trait Name
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.trait.traitName }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Trait Class
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.trait.traitClass }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Description
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.trait.description }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Main Abbreviation
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.trait.mainAbbreviation }}
                            </div>
                        </div>

                        <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Method</h4>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Method Name
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.method.methodName }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Method Class
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.method.methodClass }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Description
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.method.description }}
                            </div>
                        </div>
                        <div class="flex border rounded my-2 w-full">
                            <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                Formula
                            </div>
                            <div class="w-full sm:w-2/3 p-3 bg-white">
                                {{ selectedItem.cropOntologyData.method.formula }}
                            </div>
                        </div>

                        <div v-if="checkIfScaleExists(selectedItem.cropOntologyData)">
                            <h4 class="bg-gray-200 rounded-lg px-2 py-2 text-black text-center">Scale</h4>
                            <div class="flex border rounded my-2 w-full">
                                <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Scale Name
                                </div>
                                <div class="w-full sm:w-2/3 p-3 bg-white">
                                    {{ selectedItem.cropOntologyData.scale.scaleName }}
                                </div>
                            </div>
                            <div class="flex border rounded my-2 w-full">
                                <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Data Type
                                </div>
                                <div class="w-full sm:w-2/3 p-3 bg-white">
                                    {{ selectedItem.cropOntologyData.scale.dataType }}
                                </div>
                            </div>
                            <div class="flex border rounded my-2 w-full">
                                <div class="w-full sm:w-1/3 p-3 bg-gray-100 font-semibold capitalize">
                                    Categories
                                </div>
                                <div class="w-full sm:w-2/3 p-3 bg-white">
                                    {{ selectedItem.cropOntologyData.scale.validValues.categories }}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>


            <h2 class="text-xl text-left font-semibold text-gray-700 mb-4 my-4">Export List</h2>

            <div class="bg-gray-100 p-4 flex flex-wrap gap-4 rounded-lg shadow-md">
                <button @click="generateFieldBookFile"
                    class="bg-gray-400 p-3 text-white font-semibold hover:bg-green-600 transition duration-300 rounded-lg cursor-pointer w-full sm:w-auto flex items-center justify-center">
                    Generate Fieldbook Trait File
                    <img src="../assets/fieldbook.png" class="h-6 inline mx-2" />
                </button>

                <button @click="generateGridscoreTsv"
                    class="bg-gray-800 p-3 text-white font-semibold hover:bg-gray-900 transition duration-300 rounded-lg cursor-pointer w-full sm:w-auto flex items-center justify-center">
                    Generate Gridscore .tsv
                    <img src="../assets/gridscore.jpeg" class="h-6 inline mx-2" />
                </button>

                <button @click="generateGridscoreJSON"
                    class="bg-gray-700 p-3 text-white font-semibold hover:bg-gray-800 transition duration-300 rounded-lg cursor-pointer w-full sm:w-auto flex items-center justify-center">
                    Generate Gridscore .json
                    <img src="../assets/gridscore.jpeg" class="h-6 inline mx-2" />
                </button>
            </div>


            <div v-if="this.isOwner">
                <h2 class="text-xl text-left font-semibold text-gray-700 mb-4 my-4">Sharing details</h2>

                <div class="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
                    <button @click="handleInviteClick"
                        class="bg-blue-500 p-3 text-white font-semibold rounded-lg cursor-pointer">
                        Invite team by email +

                    </button>
                </div>
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
    max-width: 90%;
    padding: 1.5rem;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
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

@media (max-width: 640px) {
    .dashItems {
        max-width: 100%;
        padding: 1rem;
    }

    table {
        font-size: 14px;
    }

    th,
    td {
        padding: 0.5rem;
    }

    button {
        font-size: 12px;
    }
}
</style>