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
        <div v-if="isLegacyProgram" class="flex items-center justify-center w-full h-full">
            <span class="font-bold uppercase text-neutral">No data</span>
        </div>
    </Container>
</template>

<script>
import formatDate from '@/util/formatDate';
import { isDarkModeEnabled } from '@/util/darkMode';

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
                background: isDarkModeEnabled() ? 'transparent' : '#fff',
                id: 'program-heatmap-chart',
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
            stroke: {
                colors: [isDarkModeEnabled() ? '#6b7280' : '#fff']
            },
            theme: {
                mode: isDarkModeEnabled() ? 'dark' : 'light'
            },
            xaxis: {
                labels: {
                    show: false
                }
            },
            yaxis: {
                reversed: true
            }
        },
        peaks: {}
    }),
    computed: {
        isDarkModeEnabled() {
            return isDarkModeEnabled();
        },
        isLegacyProgram() {
            return this.$parent.isLegacyProgram;
        },
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
            ];
            const series = [];

            for (const [key, label] of labels) {
                const differences = performance.map(
                    (value, i) =>
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
        }
    },
    methods: {
        handleDarkModeToggle(isDarkModeEnabled) {
            this.chartOptions = {
                ...this.chartOptions,
                chart: {
                    ...this.chartOptions.chart,
                    background: isDarkModeEnabled ? 'transparent' : '#fff'
                },
                stroke: {
                    colors: [isDarkModeEnabled ? '#6b7280' : '#fff']
                },
                theme: {
                    mode: isDarkModeEnabled ? 'dark' : 'light'
                }
            };
        }
    },
    mounted() {
        this.emitter.on('dark-mode-toggle', this.handleDarkModeToggle);
    }
};
</script>
