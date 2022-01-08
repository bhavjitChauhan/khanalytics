<template>
    <div class="flex flex-col p-5 space-y-4 rounded shadow-lg">
        <h1 class="text-2xl font-bold text-center uppercase">Ratio Chart</h1>
        <p class="text-center text-slate-500">Relation between votes and forks over the past hour</p>
        <apexchart
            v-if="chartSeries[0].data.length > 0"
            type="scatter"
            width="100%"
            :options="chartOptions"
            :series="chartSeries"
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
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            legend: {
                // show: false
                position: 'right'
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
        chartSeries: [
            {
                name: 'data',
                data: []
            }
        ]
    }),
    methods: {
        prepareData() {
            const hotlistSnapshot = this.$parent.hotlistSnapshot;
            const series = [];
            hotlistSnapshot.forEach((program) => {
                series.push({
                    name: program.program_id,
                    data: [[program.votes, program.forks]]
                });
            });
            this.chartSeries = series;
        }
    },
    mounted() {
        this.emitter.on('hotlist-snapshot', this.prepareData);
    }
};
</script>
