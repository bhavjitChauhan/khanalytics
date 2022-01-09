<template>
    <div>
        <Navbar />
        <Dashboard
            :hotlistData="hotlistData"
            :statisticsData="statisticsData"
            :topData="topData"
            :hotlistSnapshot="hotlistSnapshot"
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
        statisticsData: [],
        topData: [],
        hotlistSnapshot: []
    }),
    async created() {
        await Promise.all([
            api.fetchHotlistData('week'),
            api.fetchStatisticsData(),
            api.fetchStatisticsData('top'),
            api.fetchHotlistData('snapshot')
        ]).then(([hotlistData, statisticsData, topData, hotlistSnapshot]) => {
            this.hotlistData = hotlistData;
            this.statisticsData = statisticsData;
            this.topData = topData;
            this.hotlistSnapshot = hotlistSnapshot;
        });
    },
    mounted() {
        Apex.colors = ['#14BF95', '#570DF8', '#FEB019', '#FF4560', '#008FFB'];
    }
};
</script>
