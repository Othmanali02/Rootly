import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import OntologyUpload from '@/components/OntologyUpload.vue';
import OntologyCreation from '@/components/OntologyCreation.vue';
import DashboardView from '@/components/DashboardView.vue';


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
			path: "/dashboard",
			name: "Dashboard",
			component: DashboardView,
		},
		{
			path: "/create",
			name: "OntologyCreation",
			component: OntologyCreation,
		}
	],
});


export default router;
