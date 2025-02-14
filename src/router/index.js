import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import HomePage from "../components/HomePage.vue";
import axios from "axios";
import OntologyUpload from "@/components/OntologyUpload.vue";
import OntologyCreation from "@/components/OntologyCreation.vue";
import DashboardView from "@/components/DashboardView.vue";
import ListView from "@/components/ListView.vue";
import RedirectView from "@/components/RedirectView.vue";
import TeamCreation from "@/components/TeamCreation.vue";
import TeamDetails from "@/components/TeamDetails.vue";

var user = ref(null);

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "Home",
			component: HomePage,
			props: () => ({ user: user.value }),
		},
		{
			path: "/ontologies/upload",
			name: "Upload",
			component: OntologyUpload,
			props: () => ({ user: user.value }),
		},
		{
			path: "/dashboard",
			name: "Dashboard",
			component: DashboardView,
			props: () => ({ user: user.value }),
		},
		{
			path: "/create",
			name: "OntologyCreation",
			component: OntologyCreation,
			props: () => ({ user: user.value }),
		},
		{
			path: "/teams/create",
			name: "TeamCreation",
			component: TeamCreation,
			props: () => ({ user: user.value }),
		},
		{
			path: "/teams/:teamId",
			name: "TeamDetails",
			component: TeamDetails,
			props: () => ({ user: user.value }),
		},
		{
			path: "/list/:listId",
			name: "ListView",
			component: ListView,
			props: (route) => ({
				user: user.value,
				...route.params,
			}),
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
	if (to.path !== "/redirect" && !user.value) {
		try {
			const response = await axios.get("/api/rootly/users/user-info", {
				withCredentials: true,
			});
			user.value = response.data;
			console.log(user.value);
		} catch (err) {
			if (err.status === 401) {
				console.log("login again");
				window.location.href = "http://localhost:3000/rootly/users/login";
			} else if (err.status === 400) {
				console.log("dw about it twin, just login");
			} else {
				console.error("Error fetching user data:", err);
			}
		}
	}
	next();
});

export default router;
