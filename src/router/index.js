import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import OntologyUpload from '@/components/OntologyUpload.vue';
import OntologyCreation from '@/components/OntologyCreation.vue';


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "Home",
			component: HomePage,
		},
		{
			path: "/ontologies/upload",
			name: "Upload",
			component: OntologyUpload,
		},
		{
			path: "/create",
			name: "OntologyCreation",
			component: OntologyCreation,
		}
	],
});


export default router;
