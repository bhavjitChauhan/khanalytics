<template>
    <div class="p-5 mx-32">
        <h1 class="mb-8 text-4xl font-bold">Dashboard</h1>
        <Statistics />
        <div class="grid grid-cols-2 grid-rows-1 gap-4">
            <div class="col-span-2 row-span-1">
                <MainChart />
            </div>
            <div class="col-span-1 row-span-1">
                <TopChart />
            </div>
            <div class="col-span-1 row-span-1">
                <RatioChart />
            </div>
        </div>
    </div>
</template>

<script>
import Statistics from '@/components/Statistics.vue';
import MainChart from '@/components/MainChart.vue';
import TopChart from '@/components/TopChart.vue';
import RatioChart from '@/components/RatioChart.vue';

export default {
    name: 'Dashboard',
    components: {
        Statistics,
        MainChart,
        TopChart,
        RatioChart
    },
    props: {
        hotlistData: Array,
        statisticsData: Array,
        topData: Array,
        hotlistSnapshot: Array
    },
    watch: {
        hotlistData: {
            handler: function () {
                this.emitter.emit('hotlist-data');
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
        },
        hotlistSnapshot: {
            handler: function () {
                this.emitter.emit('hotlist-snapshot');
            }
        }
    }
};
</script>

<style>
.apexcharts-zoom-icon.apexcharts-selected svg {
    fill: #570df8 !important;
}

.apexcharts-pan-icon.apexcharts-selected svg {
    stroke: #570df8 !important;
}
</style>
