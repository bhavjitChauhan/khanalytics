<template>
    <div class="flex flex-col p-5 space-y-4 rounded shadow-lg">
        <h1 class="text-2xl font-bold text-center uppercase">Ratio Chart</h1>
        <p class="text-center text-slate-500">Relation between votes and forks over the past hour</p>
        <apexchart
            v-if="chartSeries.length > 0"
            type="scatter"
            width="100%"
            :options="chartOptions"
            :series="chartSeries"
            @legendClick=handleLegendClick
        ></apexchart>
    </div>
</template>

<script>
export default {
    name: 'RatioChart',
    data: () => ({
        chartOptions: {
            chart: {
                animations: {
                    enabled: false
                },
                height: 350,
                toolbar: {
                    autoSelected: 'pan'
                },
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            legend: {
                position: 'right',
                onItemClick: {
                    toggleDataSeries: false
                }
            },
            tooltip: {
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (title) {
                            return `${title}:`;
                        }
                    }
                },
                marker: {
                    show: false
                }
            },
            xaxis: {
                tickAmount: 5,
                title: {
                    text: 'Votes'
                }
                // labels: {
                //     formatter: function (val) {
                //         return parseFloat(val).toFixed(1);
                //     }
                // }
            },
            yaxis: {
                tickAmount: 5,
                title: {
                    text: 'Forks'
                }
            }
        },
        chartSeries: [],
        mappings: []
    }),
    methods: {
        prepareData() {
            const hotlistSnapshot = this.$parent.hotlistSnapshot;
            const series = [];
            const mappings = [];

            hotlistSnapshot.forEach((program) => {
                series.push({
                    name: program.program_id,
                    data: [[program.votes, program.forks]]
                });
                mappings.push(program.program_id);
            });

            this.chartSeries = series;
            this.mappings = mappings;
        },
        handleLegendClick(_chartContext, seriesIndex) {
            const BASE_URL = 'https://khanacademy.org/cs/-/';
            const url = BASE_URL + this.mappings[seriesIndex];

            window.open(url, '_blank');
        }
    },
    mounted() {
        this.emitter.on('hotlist-snapshot', this.prepareData);
    }
};
</script>
