<template>
    <div class="p-5 mx-32">
        <h1 class="mb-8 text-4xl font-bold">Dashboard</h1>
        <Statistics />
        <MainChart />
    </div>
</template>

<script>
import Statistics from '@/components/Statistics.vue';
import MainChart from '@/components/MainChart.vue';

export default {
    name: 'Dashboard',
    components: {
        Statistics,
        MainChart
    },
    props: {
        hotlistData: Array,
        uniquePrograms: Number,
        votesVolume: Number,
        forksVolume: Number
    },
    watch: {
        hotlistData: {
            handler: function () {
                this.emitter.emit('hotlist-data');
            }
        },
        uniquePrograms: {
            handler: function () {
                this.emitter.emit('unique-programs');
            }
        },
        votesVolume: {
            handler: function () {
                this.emitter.emit('votes-volume');
            }
        },
        forksVolume: {
            handler: function () {
                this.emitter.emit('forks-volume');
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
