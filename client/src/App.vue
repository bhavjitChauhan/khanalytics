<template>
    <div>
        <Navbar />
        <Dashboard
            :hotlistData="hotlistData"
            :statisticsData="statisticsData"
            :topData="topData"
            :hotlistSnapshot="hotlistSnapshot"
        />
        <Footer />
    </div>
</template>

<script>
import api from '@/services/api';
import sleep from '@/lib/sleep';

import Navbar from '@/components/Navbar.vue';
import Dashboard from '@/components/Dashboard.vue';
import Footer from '@/components/Footer.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Dashboard,
        Footer
    },
    data: () => ({
        hotlistData: [],
        statisticsData: [],
        topData: [],
        hotlistSnapshot: []
    }),
    async created() {
        // Repl.it doesn't play well with fetching data too fast
        this.hotlistData = await api.fetchHotlistData('week');
        await sleep(500);
        this.statisticsData = await api.fetchStatisticsData();
        await sleep(500);
        this.topData = await api.fetchStatisticsData('top');
        await sleep(500);
        this.hotlistSnapshot = await api.fetchHotlistData('snapshot');

        // await Promise.all([
        //     api.fetchHotlistData('week'),
        //     api.fetchStatisticsData(),
        //     api.fetchStatisticsData('top'),
        //     api.fetchHotlistData('snapshot')
        // ]).then(([hotlistData, statisticsData, topData, hotlistSnapshot]) => {
        //     this.hotlistData = hotlistData;
        //     this.statisticsData = statisticsData;
        //     this.topData = topData;
        //     this.hotlistSnapshot = hotlistSnapshot;
        // });
    },
    mounted() {
        Apex.colors = ['#14BF95', '#570DF8', '#FEB019', '#FF4560', '#008FFB'];
    }
};
</script>
