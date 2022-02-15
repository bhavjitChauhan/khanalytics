<template>
    <div class="mb-8">
        <h1 class="mb-2 text-4xl font-bold">Dashboard</h1>
        <span class="text-lg">This is an overview of the performance of the <a
                href="https://khanacademy.org/browse"
                target="_blank"
                class="link"
            >Hotlist</a>. Use the &nbsp; <font-awesome-icon icon="info"></font-awesome-icon> &nbsp; icons to see what information is displayed. Click on a specific program to view more detailed statistics for that program.</span>
    </div>
    <Statistics />
    <div class="grid grid-cols-4 grid-rows-1 gap-4">
        <div class="hidden col-span-1 row-span-1 lg:flex">
            <HotTable />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-3">
            <MainChart height="550px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-2">
            <TopChart height="400px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-2">
            <RatioChart height="400px" />
        </div>
    </div>
</template>

<script>
import Statistics from '@/views/Dashboard/Statistics.vue';
import HotTable from '@/views/Dashboard/HotTable.vue';
import MainChart from '@/views/Dashboard/MainChart.vue';
import TopChart from '@/views/Dashboard/TopChart.vue';
import RatioChart from '@/views/Dashboard/RatioChart.vue';

export default {
    name: 'Dashboard',
    components: {
        Statistics,
        HotTable,
        MainChart,
        TopChart,
        RatioChart
    },
    computed: {
        statisticsData() {
            return this.$store.state.statisticsData;
        },
        hotlistSnapshot() {
            return this.$store.state.hotlistSnapshot;
        },
        performanceTopData() {
            return this.$store.state.performanceTopData;
        }
    },
    watch: {
        statisticsData: {
            handler: function () {
                this.emitter.emit('statistics-data');
            }
        },
        hotlistSnapshot: {
            handler: function () {
                this.emitter.emit('hotlist-snapshot');
            }
        },
        performanceTopData: {
            handler: function () {
                this.emitter.emit('performance-top-data');
            }
        }
    }
};
</script>

<style>
.apexcharts-zoom-icon.apexcharts-selected svg {
    fill: #14bf95 !important;
}

.apexcharts-pan-icon.apexcharts-selected svg {
    stroke: #14bf95 !important;
}
</style>
