import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import HomePage from "../components/HomePage.vue";
import axios from "axios";
import OntologyCreation from "@/components/OntologyCreation.vue";
import DashboardView from "@/components/DashboardView.vue";
import ListView from "@/components/ListView.vue";
import RedirectView from "@/components/RedirectView.vue";
import TeamCreation from "@/components/TeamCreation.vue";
import TeamDetails from "@/components/TeamDetails.vue";
import NotAuthorized from "@/components/NotAuthorized.vue";
import apiService from "@/services/apiRoutes";
import AboutView from "@/components/AboutView.vue";

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
			path: "/about",
			name: "AboutView",
			component: AboutView,
			props: () => ({ user: user.value }),
		},
		{
			path: "/dashboard",
			name: "Dashboard",
			component: DashboardView,
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
			props: (route) => ({
				user: user.value,
				...route.params,
			}),
		},
		{
			path: "/lists/:listId",
			name: "ListView",
			component: ListView,
			props: (route) => ({
				user: user.value,
				...route.params,
			}),
		},
		{
			path: "/lists/create",
			name: "OntologyCreation",
			component: OntologyCreation,
			props: () => ({ user: user.value }),
		},
		{
			path: "/redirect",
			name: "RedirectView",
			component: RedirectView,
			props: true,
		},
		{
			path: "/not-authorized",
			name: "NotAuthorized",
			component: NotAuthorized,
			props: () => ({ user: user.value }),
		},
	],
});

router.beforeEach(async (to, from, next) => {
	if (to.path !== "/redirect" && !user.value) {
		try {
			// check the UUID too not just the token big bro
			const response = await axios.get("/api/rootly/users/user-info", {
				withCredentials: true,
			});
			user.value = response.data;
			console.log(user.value);
		} catch (err) {
			if (err.status === 401) {
				console.log("login again");
				window.location.href = "/api/rootly/users/login";
			} else if (err.status === 400) {
				console.log("dw about it twin, just login");
			} else {
				console.error("Error fetching user data:", err);
			}
		}
	}

	if (to.path === "/teams/create" || to.path === "/lists/create") {
		return next();
	}

	if (to.path.includes("/lists/")) {
		const listId = to.params.listId;
		console.log("Checking access for list " + listId);

		try {
			const listResponse = await apiService.listStatus(listId);
			console.log("Checking access for list " + listId);
			console.log(listResponse.data);

			// checks  if the user is either the owner or if the list is shared with them
			if (!listResponse.data.isOwner && !listResponse.data.isMember) {
				console.log("User is not authorized to view this list");
				return next({ path: "/not-authorized" });
			}
		} catch (err) {
			console.error("Error fetching list data:", err);
			return next({ path: "/error" });
		}
	}

	// Check access for /teams/:teamId
	if (to.path.includes("/teams/")) {
		const teamId = to.params.teamId;
		console.log("Checking access for team " + teamId);

		try {
			const teamResponse = await apiService.teamStatus(teamId);
			console.log(teamResponse.data);
			if (!teamResponse.data.isMember && !teamResponse.data.isOwner) {
				console.log("User is not authorized to view this team");
				return next({ path: "/not-authorized" });
			}
		} catch (err) {
			console.error("Error fetching team data:", err);
			return next({ path: "/error" });
		}
	}

	next();
});

export default router;
