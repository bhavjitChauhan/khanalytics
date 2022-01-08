<template>
    <div class="flex flex-col p-5 space-y-4 rounded shadow-lg">
        <h1 class="text-2xl font-bold text-center uppercase">Top Chart</h1>
        <p class="text-center text-slate-500">How many hours each program stayed atop the hotlist last week</p>
        <apexchart
            v-if="chartSeries.length > 0"
            type="pie"
            width="100%"
            :options="chartOptions"
            :series="chartSeries"
        ></apexchart>
    </div>
</template>

<script>
export default {
    name: 'TopChart',
    data: () => ({
        chartOptions: {
            chart: {
                animations: {
                    enabled: false
                },
                // width: 380,
                type: 'pie'
            },
            labels: []
        },
        chartSeries: []
    }),
    methods: {
        prepareData() {
            const topData = this.$parent.topData;
            const programs = topData.map((entry) => entry.program_id);
            let counts = {};
            programs.forEach((program) => {
                counts[program] = (counts[program] || 0) + 1;
            });
            counts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            this.chartOptions.labels = counts.map((count) => count[0]);
            this.chartSeries = counts.map((count) => count[1]);
        }
    },
    mounted() {
        this.emitter.on('top-data', this.prepareData);
    }
};
</script>
