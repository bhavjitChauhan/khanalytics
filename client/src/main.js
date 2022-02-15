import mitt from 'mitt';
import { createApp } from 'vue';
import VueGtag from "vue-gtag";
import VueApexCharts from 'vue3-apexcharts';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router'
import store from './store'
import './lib/fontawesome';
import './index.css';


const emitter = mitt();

const app = createApp(App)
app.config.globalProperties.emitter = emitter;
app.config.globalProperties.$window = window;
app.config.compilerOptions.isCustomElement = (tag) => {
    return tag == 'marquee';
};
app
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(store)
    .use(VueApexCharts)
    .use(VueGtag, {
        config: { id: 'G-NSE87WJS3R' },
        enabled: process.env.NODE_ENV == 'production'
    })
    .mount('#app');
