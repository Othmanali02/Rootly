# Rootly

![logomockup6](https://github.com/user-attachments/assets/8edf420b-34ce-4ebd-9643-cc8e2b68322a)

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green.svg)](https://vuejs.org/)  
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Build](https://img.shields.io/github/actions/workflow/status/Othmanali02/Rootly/build.yml)](https://github.com/Othmanali02/Rootly/actions)

Rootly is a collaborative ontology management web application that allows plant breeders and researchers to create lists of variables directly from the CropOntology database using the BrAPI standard. Users can create teams, share lists within their teams, and integrate lists with apps like Fieldbook and Gridscore for data collection.

## 🌿 Features

- 🌱 **Ontology Management** - Browse and select variables from the CropOntology database
- 🏗 **BrAPI Standard** - Allows interoperability with other BrAPPs
- 🔗 **Team Collaboration** - Share and manage lists within teams
- 📱 **Integration Ready** - Exports to Fieldbook and Gridscore for standardized data collection
- ⚡ **Fast & Responsive** - Built with Vue.js for a smooth user experience

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended, I am using v23)
- [Vue CLI](https://cli.vuejs.org/)
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Othmanali02/Rootly.git
cd Rootly

# Install dependencies
npm install

# Start development server
npm run serve
```

The frontend should now be running at `http://localhost:5173/`.

---

## 📁 Project Structure

```
rootly-frontend/
│── public/           # Static assets
│── src/
│   ├── assets/       # Images, icons, styles
│   ├── components/   # Reusable Vue components
│   ├── router/       # Vue Router configuration
│   ├── services/     # API calls & business logic
│   ├── main.js       # App entry point
│   ├── App.vue       # App.vue file
│── .env              # Environment variables
│── vite.config.js    # Vite configuration
│── package.json      # Dependencies & scripts
```

---

## 🔗 API Integration

This vuejs application communicates with the [Rootly Backend](https://github.com/Othmanali02/RootlyBackend), a Nodejs API that manages user authentication, teams, lists, and CropOntology interactions. Ensure the backend is running before testing full functionality.

### Environment Variables

Make sure the .env file points to where the backend is running, this could be the name of the container you are running the app on if you are using docker, or just localhost if you're using it locally.
```
VUE_APP_API_PROXY=http://localhost:3000
```
---

## 🤝 Contributing

Rootly welcomes contributions! To contribute to this project:

1. Fork the repository
2. Create a new branch (`Rootly/very-cool-feature`)
3. Commit your changes
4. Push to your fork and open a pull request !

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
