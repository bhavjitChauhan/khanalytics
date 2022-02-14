<template>
    <Container
        id="program-rank-chart"
        class="relative"
        :height="height"
    >
        <apexchart
            v-if="chartSeries"
            width="100%"
            height="100%"
            type="heatmap"
            :options="chartOptions"
            :series="chartSeries"
        ></apexchart>
        <InfoButton
            v-if="chartSeries"
            id="heatmap-chart-modal"
            :corner="true"
        >
            <p>
                This chart shows how much each metric changed over time. Change is measured hourly.
            </p>
            <br>
            <p>
                <b>Download the data</b> or save the chart as an image by clicking the &nbsp;
                <font-awesome-icon icon="bars" /> &nbsp; icon.
            </p>
        </InfoButton>
    </Container>
</template>

<script>
import formatDate from '@/util/formatDate';

import Container from '@/components/Container.vue';
import InfoButton from '@/components/InfoButton.vue';

export default {
    name: 'HeatMapChart',
    components: {
        Container,
        InfoButton
    },
    props: {
        height: String,
        id: String
    },
    data: () => ({
        chartOptions: {
            chart: {
                animations: {
                    enabled: false
                },
                toolbar: {
                    tools: {
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                heatmap: {
                    distributed: true
                }
            },
            xaxis: {
                labels: {
                    show: false
                }
            }
        },
        peaks: {}
    }),
    computed: {
        performance() {
            return this.$parent.performance;
        },
        chartSeries() {
            const performance = this.performance;
            if (!performance) return null;

            const labels = [
                ['rank', 'Rank'],
                ['votes', 'Votes'],
                ['forks', 'Forks'],
                ['comments', 'Comments'],
                ['commentVotes', 'Upvotes'],
                ['replies', 'Replies']
            ].reverse();
            const series = [];

            for (const [key, label] of labels) {
                const differences = performance.map((value, i) =>
                    Math.abs(
                        value[key] - (i === 0 ? 0 : performance[i - 1][key])
                    ) || 0
                );
                this.peaks[key] = Math.max(...differences);

                series.push({
                    name: label,
                    data: performance.map(({ timestamp }, i) => {
                        const data = [formatDate(timestamp), differences[i]];
                        return data;
                    })
                });
            }

            return series;
            // [{
            //   name: 'Metric1',
            //   data: generateData(18, {
            //     min: 0,
            //     max: 90
            //   })
            // },
        }
    }
};
</script>
