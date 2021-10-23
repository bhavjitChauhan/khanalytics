<template>
    <div>
        <Navbar />
        <Dashboard :hotlistData="hotlistData" />
    </div>
</template>

<script>
import api from '@/services/api';

import Navbar from '@/components/Navbar.vue';
import Dashboard from '@/components/Dashboard.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Dashboard
    },
    data: () => ({
        hotlistData: []
    }),
    async created() {
        const response = await api.fetchHotlistData('week');
        this.hotlistData = response.data;
    },
    mounted() {
        Apex.colors = ['#570df8', '#00E396', '#FEB019', '#FF4560', '#008FFB'];
    }
};
</script>
