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
        this.statisticsData = await api.fetchStatisticsData();
        await sleep(500);
        this.topData = await api.fetchStatisticsData('top');
        await sleep(500);
        this.hotlistData = await api.fetchHotlistData('week');
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

<style>
::-webkit-scrollbar {
    width: 20px;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #a8bbbf;
}
</style>
