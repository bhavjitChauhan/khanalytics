export const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue')
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/Contact.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard')
    },
    {
        path: '/program/:id(\\d+)',
        name: 'program',
        component: () => import('../views/Program'),
        meta: {
            sitemap: {
                ignoreRoute: true
            }
        }
    },
    {
        path: '/search/:query?',
        name: 'search',
        component: () => import('../views/Search.vue'),
        meta: {
            sitemap: {
                ignoreRoute: true
            }
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('../views/NotFound.vue'),
        meta: {
            sitemap: {
                ignoreRoute: true
            }
        }
    },
];
