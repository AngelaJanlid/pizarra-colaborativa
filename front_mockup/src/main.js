import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'vue-toastification/dist/index.css';
import Toast from 'vue-toastification';



const app = createApp(App);

app.use(router);
app.use(Toast);
app.mount('#app');
