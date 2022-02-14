<template>
    <div class="p-5 mx-32">
        <h1 class="mb-8 text-4xl font-bold">Dashboard</h1>
        <!-- todo: use Container component -->
        <Statistics />
        <div class="grid grid-cols-4 grid-rows-1 gap-4">
            <div class="col-span-1 row-span-1">
                <HotTable />
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
