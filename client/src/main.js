import { createApp } from 'vue';
import App from './App.vue';
import VueGtag from "vue-gtag";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import {
    faAngleDown,
    faAngleDoubleDown,
    faAngleDoubleUp,
    faAngleUp,
    faBars,
    faEquals,
    faHistory,
    faInfo
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueApexCharts from 'vue3-apexcharts';
import mitt from 'mitt';

import './index.css';
import router from './router'

library.add(
    faAngleDown,
    faAngleDoubleDown,
    faAngleDoubleUp,
    faAngleUp,
    faBars,
    faEquals,
    faHistory,
    faInfo
);
library.add(faQuestionCircle);

const emitter = mitt();

const app = createApp(App)
app.config.globalProperties.emitter = emitter;
app.config.globalProperties.$mappings = {};
app
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(VueApexCharts)
    .use(VueGtag, {
        config: { id: 'G-NSE87WJS3R' },
        enabled: process.env.NODE_ENV == 'production'
    })
    .mount('#app');
