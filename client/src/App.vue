<template>
    <div>
        <Navbar />
        <Dashboard
            :hotlistData="hotlistData"
            :statisticsData="statisticsData"
        />
    </div>
</template>

<script>
/* global Apex */

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
        hotlistData: [],
        statisticsData: []
    }),
    async created() {
        await Promise.all([
            api.fetchHotlistData('week'),
            api.fetchStatisticsData()
        ]).then(([hotlistData, statisticsData]) => {
            this.hotlistData = hotlistData;
            this.statisticsData = statisticsData;
        });
    },
    mounted() {
        Apex.colors = ['#570df8', '#00E396', '#FEB019', '#FF4560', '#008FFB'];
    }
};
</script>
