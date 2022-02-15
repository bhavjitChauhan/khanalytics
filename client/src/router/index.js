import { createRouter, createWebHashHistory } from 'vue-router';

import toTitleCase from '../util/toTitleCase';
import Home from '@/views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/about',
        name: 'about',
        component: function () {
            return import('../views/About.vue');
        }
    },
    {
        path: '/contact',
        name: 'contact',
        component: function () {
            return import('../views/Contact.vue');
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: function () {
            return import('../views/Dashboard');
        }
    },
    {
        path: '/program/:id(\\d+)',
        name: 'program',
        component: function () {
            return import('../views/Program');
        }
    },
    {
        path: '/search/:query?',
        name: 'search',
        component: function () {
            return import('../views/Search.vue');
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: function () {
            return import('../views/NotFound.vue');
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});
router.afterEach((to) => {
    document.title = to.name ? `${toTitleCase(to.name)} | Khanalytics` : 'Khanalytics';
});


export default router;
