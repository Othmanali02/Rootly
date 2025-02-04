import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import OntologyUpload from '@/components/OntologyUpload.vue';


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
			path: "/",
			name: "Home",
			component: HomePage,
		}
	],
});


export default router;
