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
            @legendClick=handleLegendClick
        ></apexchart>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    name: 'TopChart',
    data: () => ({
        chartOptions: {
            chart: {
                animations: {
                    enabled: false
                },
                type: 'pie'
            },
            labels: [],
            legend: {
                onItemClick: {
                    toggleDataSeries: false
                }
            }
        },
        chartSeries: [],
        mappings: []
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

            this.fetchProgramsData();
        },
        async fetchProgramsData() {
            const MAX_TITLE_LENGTH = 32;

            const ids = this.chartOptions.labels;
            const titles = [];

            for (const id of ids) {
                await api
                    .fetchProgramData(
                        `scratchpads/${id}?projection={"title":1}`
                    )
                    .then((program) => {
                        let title = program.title;
                        if (title.length > MAX_TITLE_LENGTH) {
                            title =
                                title.substring(0, MAX_TITLE_LENGTH - 3) +
                                '...';
                        }
                        titles.push(title);
                    });
            }

            this.chartOptions = {
                ...this.chartOptions,
                labels: titles
            };
            this.mappings = ids;
        },
        handleLegendClick(_chartContext, seriesIndex) {
            const BASE_URL = 'https://khanacademy.org/cs/-/';
            const url = BASE_URL + this.mappings[seriesIndex];

            window.open(url, '_blank');
        }
    },
    mounted() {
        this.emitter.on('top-data', this.prepareData);
    }
};
</script>
