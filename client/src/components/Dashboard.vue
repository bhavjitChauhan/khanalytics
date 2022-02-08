<template>
    <div class="p-5 mx-32">
        <h1 class="mb-8 text-4xl font-bold">Dashboard</h1>
        <Statistics />
        <div class="grid grid-cols-4 grid-rows-1 gap-4">
            <div class="col-span-1 row-span-1">
                <HotlistTable />
            </div>
            <div class="col-span-3 row-span-1">
                <MainChart />
            </div>
            <div class="col-span-2 row-span-1">
                <TopChart />
            </div>
            <div class="col-span-2 row-span-1">
                <RatioChart />
            </div>
        </div>
    </div>
</template>

<script>
import Statistics from '@/components/Statistics.vue';
import HotlistTable from '@/components/HotlistTable.vue';
import MainChart from '@/components/MainChart.vue';
import TopChart from '@/components/TopChart.vue';
import RatioChart from '@/components/RatioChart.vue';

export default {
    name: 'Dashboard',
    components: {
        Statistics,
        HotlistTable,
        MainChart,
        TopChart,
        RatioChart
    },
    props: {
        hotlistSnapshot: Object,
        performanceTopData: Array,
        statisticsData: Array,
        topData: Array
    },
    watch: {
        hotlistSnapshot: {
            handler: function () {
                this.emitter.emit('hotlist-snapshot');
            }
        },
        performanceTopData: {
            handler: function () {
                this.emitter.emit('performance-top-data');
            }
        },
        statisticsData: {
            handler: function () {
                this.emitter.emit('statistics-data');
            }
        },
        topData: {
            handler: function () {
                this.emitter.emit('top-data');
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
