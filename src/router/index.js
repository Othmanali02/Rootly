import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import HomePage from "../components/HomePage.vue";
import axios from "axios";
import OntologyUpload from "@/components/OntologyUpload.vue";
import OntologyCreation from "@/components/OntologyCreation.vue";
import DashboardView from "@/components/DashboardView.vue";
import ListView from "@/components/ListView.vue";
import RedirectView from "@/components/RedirectView.vue";

const user = ref(null);

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
		},
		{
			path: "/list/:listId",
			name: "ListView",
			component: ListView,
			props: true,
		},
		{
			path: "/redirect",
			name: "RedirectView",
			component: RedirectView,
			props: true,
		},
	],
});

router.beforeEach(async (to, from, next) => {
	if (!user.value) {
		try {
			const response = await axios.get("/api/user-info", {
				withCredentials: true,
			});
			console.log(response);
			user.value = response.data;
		} catch (err) {
			console.error("Error fetching user data:", err);
		}
	}
	next();
});

export default router;
