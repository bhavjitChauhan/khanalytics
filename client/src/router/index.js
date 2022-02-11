import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: function () {
            return import('../views/About.vue');
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: function () {
            return import('../views/Dashboard.vue');
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
