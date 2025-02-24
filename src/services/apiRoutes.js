import axios from "axios";

const airtable = true;
const baseUrl = airtable ? "/api/rootly/airtable" : "/api/rootly";

const apiService = {
	async login() {
		return await axios.get(`${baseUrl}/users/login`);
	},
	async logout() {
		return await axios.get(`${baseUrl}/users/logout`);
	},
	async createList(traits, listName, UUID) {
		return axios.post(`${baseUrl}/lists/createList`, {
			traits: traits,
			listName: listName,
			userId: UUID,
		});
	},
	async addCustomVariable(listId, listBrowID, listName, inputValue) {
		return await axios.post(
			`${baseUrl}/lists/addCustomVariable`,
			{
				listId: listId,
				listBrowID: listBrowID,
				listName: listName,
				userInput: inputValue,
			}
		);
	},
	async addVariable(listId, listBrowID, listName, selectedTraits) {
		return await axios.post(`${baseUrl}/lists/addVariable`, {
			listId: listId,
			listBrowID: listBrowID,
			listName: listName,
			selectedVariables: selectedTraits,
		});
	},
	async removeVariable(listId, listBrowID, baserowID) {
		return await axios.post(
			`${baseUrl}/lists/removeVariable`,
			{
				listId: listId,
				listBrowID: listBrowID,
				listContentBrowID: baserowID,
			}
		);
	},
	async addMultipleCustomVariables(listId, listBrowID, listName, chosenLists) {
		return axios.post(`${baseUrl}/lists/addMultipleCustomVariables`, {
			listId: listId,
			listBrowID: listBrowID,
			listName: listName,
			chosenVariables: chosenLists,
		});
	},
	async getUserCustomVariables() {
		return await axios.get(`${baseUrl}/lists/userCustomVariables`);
	},
	async getUserLists(email) {
		// could perhaps or mayhaps or perchance create a new request that gets the user lists by UUID
		return await axios.post(`${baseUrl}/lists/getUserLists`, {
			email: email,
		});
	},
	async getUserTeams(userID) {
		return await axios.post(`${baseUrl}/teams/getUserTeams`, {
			userId: userID,
		});
	},
	async listStatus(listId) {
		return await axios.get(`${baseUrl}/users/status/${listId}`, {
			withCredentials: true,
		});
	},
	async getListInfo(listId) {
		return await axios.post(`${baseUrl}/lists/getListInfo`, {
			listId: listId,
		});
	},
	async addMember(id, email, members) {
		return await axios.patch(`${baseUrl}/teams/addMember`, {
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
		return axios.post(`${baseUrl}/teams/createTeam`, {
			invitedMembers: invitedMembers,
			chosenLists: chosenLists,
			teamName: teamName,
			description: teamDescription,
			userId: UUID,
		});
	},
	async teamStatus(teamId) {
		return await axios.get(`${baseUrl}/teams/status/${teamId}`, {
			withCredentials: true,
		});
	},
	async getTeamInfo(teamId) {
		return axios.post(`${baseUrl}/teams/getTeamInfo`, {
			teamId: teamId,
		});
	},
	async removeMember(teamId, memberID, teamMembers) {
		return axios.patch(`${baseUrl}/teams/removeMember`, {
			teamId: teamId,
			memberID: memberID,
			teamMembers: teamMembers,
		});
	},
};

export default apiService;
