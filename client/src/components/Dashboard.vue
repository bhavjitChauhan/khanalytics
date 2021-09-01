<template>
    <div class="p-5 mx-32">
        <h1 class="mb-8 text-4xl font-bold">Dashboard</h1>
        <MainChart />
    </div>
</template>

<script>
import MainChart from '@/components/MainChart.vue';

export default {
    name: 'Dashboard',
    components: {
        MainChart
    },
    props: {
        hotlistData: Array
    },
    watch: {
        hotlistData: {
            handler: function () {
                this.emitter.emit('hotlist-data');
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
