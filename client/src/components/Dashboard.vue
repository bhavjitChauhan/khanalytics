<template>
    <div class="p-5 mx-32">
        <div class="alert alert-warning mb-4">
            <div class="flex-1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="w-6 h-6 mx-2 stroke-current"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                </svg>
                <label>Load times may be slow due to issues with Replit</label>
            </div>
        </div>
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
