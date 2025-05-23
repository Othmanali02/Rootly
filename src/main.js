import { createApp } from 'vue'
import App from './App.vue'
import './assets/app.css'
import router from './router';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const app = createApp(App);
app.use(Toast);

app.use(router);
app.mount('#app'); 