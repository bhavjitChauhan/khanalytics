<template>
    <div>
        <Navbar />
        <Dashboard
            :performanceTopData="performanceTopData"
            :statisticsData="statisticsData"
            :topData="topData"
            :hotlistSnapshot="hotlistSnapshot"
        />
        <Footer />
    </div>
</template>

<script>
import api from '@/services/api';

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
        hotlistSnapshot: {},
        performanceTopData: [],
        statisticsData: [],
        topData: []
    }),
    async created() {
        await Promise.all([
            api.fetch(
                '/khan/scratchpads/top?sort=3&limit=100&projection={"scratchpads":1}'
            ),
            api.fetch('/performance/top/10'),
            api.fetchStatisticsData()
        ]).then(
            ([
                hotlistSnapshot,
                performanceTopData,
                statisticsData,
                topData
            ]) => {
                this.prepareHotlistSnapshot(hotlistSnapshot);
                this.performanceTopData = performanceTopData;
                this.statisticsData = statisticsData;
            }
        );
    },
    methods: {
        prepareHotlistSnapshot(hotlistSnapshot) {
            const snapshot = {};
            const scratchpads = hotlistSnapshot.scratchpads;
            for (const i in scratchpads) {
                const scratchpad = scratchpads[i];
                const id = scratchpad.url.split('/')[5];
                snapshot[id] = {
                    title: scratchpad.title,
                    rank: parseInt(i, 10) + 1,
                    votes: scratchpad.sumVotesIncremented,
                    forks: scratchpad.spinoffCount
                };
            }
            this.hotlistSnapshot = snapshot;
        }
    },
    mounted() {
        Apex.colors = ['#14BF95', '#570DF8', '#FEB019', '#FF4560', '#008FFB'];
    }
};
</script>

<style>
::-webkit-scrollbar {
    width: 1em;
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
