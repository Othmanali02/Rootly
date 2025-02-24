import axios from "axios";

// const api = axios.create({
// 	baseURL: "http://localhost:3000",
// 	headers: {
// 		"Content-Type": "application/json",
// 	},
// });

const apiService = {
	async login() {
		return await axios.get("http://localhost:3000/rootly/users/login");
	},
	async logout() {
		return await axios.get("/api/rootly/users/logout");
	},
	async createList(traits, listName, UUID) {
		return axios.post("http://localhost:3000/rootly/lists/createList", {
			traits: traits,
			listName: listName,
			userId: UUID,
		});
	},
	async addCustomVariable(listId, listBrowID, listName, inputValue) {
		return await axios.post(
			`http://localhost:3000/rootly/lists/addCustomVariable`,
			{
				listId: listId,
				listBrowID: listBrowID,
				listName: listName,
				userInput: inputValue,
			}
		);
	},
	async addVariable(listId, listBrowID, listName, selectedTraits) {
		return await axios.post(`http://localhost:3000/rootly/lists/addVariable`, {
			listId: Number(listId),
			listBrowID: Number(listBrowID),
			listName: listName,
			selectedVariables: selectedTraits,
		});
	},
	async removeVariable(listId, listBrowID, baserowID) {
		return await axios.post(
			`http://localhost:3000/rootly/lists/removeVariable`,
			{
				listId: listId,
				listBrowID: listBrowID,
				listContentBrowID: baserowID,
			}
		);
	},
	async addMultipleCustomVariables(listId, listBrowID, listName, chosenLists) {
		return axios.post(`/api/rootly/lists/addMultipleCustomVariables`, {
			listId: listId,
			listBrowID: listBrowID,
			listName: listName,
			chosenVariables: chosenLists,
		});
	},
	async getUserCustomVariables() {
		return await axios.get("/api/rootly/lists/userCustomVariables");
	},
	async getUserLists(email) {
        // could perhaps or mayhaps or perchance create a new request that gets the user lists by UUID
		return await axios.post(`http://localhost:3000/rootly/lists/getUserLists`, {
			email: email,
		});
	},
	async getUserTeams(userID) {
		return await axios.post(`http://localhost:3000/rootly/teams/getUserTeams`, {
			userId: userID,
		});
	},
	async listStatus(listId) {
		return await axios.get(`/api/rootly/users/status/${listId}`, {
			withCredentials: true,
		});
	},
	async getListInfo(listId) {
		return await axios.post(`http://localhost:3000/rootly/lists/getListInfo`, {
			listId: listId,
		});
	},
	async addMember(id, email, members) {
		return await axios.patch(`http://localhost:3000/rootly/teams/addMember`, {
			teamId: id,
			memberEmail: email,
			teamMembers: members,
		});
	},
	async createTeam(
		invitedMembers,
		chosenLists,
		teamName,
		teamDescription,
		UUID
	) {
		return axios.post("http://localhost:3000/rootly/teams/createTeam", {
			invitedMembers: invitedMembers,
			chosenLists: chosenLists,
			teamName: teamName,
			description: teamDescription,
			userId: UUID,
		});
	},
	async teamStatus(teamId) {
		return await axios.get(`/api/rootly/teams/status/${teamId}`, {
			withCredentials: true,
		});
	},
	async getTeamInfo(teamId) {
		return axios.post(`http://localhost:3000/rootly/teams/getTeamInfo`, {
			teamId: teamId,
		});
	},
	async removeMember(teamId, memberID, teamMembers) {
		return axios.patch(`http://localhost:3000/rootly/teams/removeMember`, {
			teamId: teamId,
			memberID: memberID,
			teamMembers: teamMembers,
		});
	},
};

export default apiService;
