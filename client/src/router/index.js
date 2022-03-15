import { createRouter, createWebHistory } from 'vue-router';

import toTitleCase from '../util/toTitleCase';
import { routes } from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes
});
router.afterEach((to) => {
    document.title = to.name ? `${toTitleCase(to.name)} | Khanalytics` : 'Khanalytics';
});


export default router;
