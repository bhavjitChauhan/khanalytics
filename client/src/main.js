import { createApp } from 'vue';
import App from './App.vue';

import VueApexCharts from "vue3-apexcharts";
import mitt from 'mitt';

import './index.css';


const emitter = mitt();

const app = createApp(App)
app.config.globalProperties.emitter = emitter;
app.use(VueApexCharts);
app.mount('#app');
