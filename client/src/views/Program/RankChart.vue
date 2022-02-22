<template>
    <Container
        id="program-rank-chart"
        class="relative"
        :height="height"
    >
        <apexchart
            v-if="chartSeries && peak <= 10"
            width="100%"
            height="100%"
            type="rangeBar"
            :options="chartOptions"
            :series="chartSeries"
        ></apexchart>
        <div
            v-else-if="isPredatingProgram || peak > 10"
            class="flex items-center justify-center w-full h-full"
        >
            <span class="font-bold uppercase text-neutral">No data</span>
        </div>
        <InfoButton
            v-if="chartSeries"
            id="rank-chart-modal"
            :corner="true"
        >
            <p>
                This chart shows how long the current program stayed in the top 10 on the Hotlist. The rank of the program on the Hotlist is displayed along the left axis.
            </p>
            <br>
            <p>
                <b>Use the toolbar</b> at the top-right to manipulate the chart. Hover over the icons for more information.
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
import { isDarkModeEnabled } from '@/util/darkMode';

import Container from '@/components/Container.vue';
import InfoButton from '@/components/InfoButton.vue';

export default {
    name: 'RankChart',
    components: {
        Container,
        InfoButton
    },
    props: {
        id: String,
        height: String
    },
    data: () => ({
        chartOptions: {
            chart: {
                background: isDarkModeEnabled() ? 'transparent' : '#fff',
                id: 'program-rank-chart'
            },
            plotOptions: {
                bar: {
                    horizontal: true
                }
            },
            theme: {
                mode: isDarkModeEnabled() ? 'dark' : 'light'
            },
            tooltip: {
                x: {
                    show: true,
                    format: 'dd MMM HH:00',
                    formatter: undefined
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false
                }
            },
            yaxis: {
                title: {
                    text: 'Rank'
                }
            }
        }
    }),
    computed: {
        isDarkModeEnabled() {
            return isDarkModeEnabled();
        },
        isPredatingProgram() {
            return this.$parent.isPredatingProgram;
        },
        performance() {
            return this.$parent.performance;
        },
        peak() {
            const performance = this.performance;
            if (!performance) return null;

            return Math.min(...performance.map((obj) => obj.rank));
        },
        chartSeries() {
            const performance = this.performance;
            if (!performance) return null;

            const series = [];
            const positions = [
                'First',
                'Second',
                'Third',
                'Fourth',
                'Fifth',
                'Sixth',
                'Seventh',
                'Eighth',
                'Ninth',
                'Tenth'
            ];

            var lastTimestamp = performance[0].timestamp;
            var previousRank = performance[0].rank;
            for (const i in performance) {
                const value = performance[i];
                if (
                    (value.rank != previousRank ||
                        i == performance.length - 1) &&
                    value.rank <= positions.length &&
                    previousRank <= positions.length
                ) {
                    series.push({
                        x: positions[previousRank - 1],
                        y: [lastTimestamp, performance[i - 1].timestamp]
                    });
                    lastTimestamp = performance[i - 1].timestamp;
                }
                previousRank = value.rank;
            }
            series.sort(
                (a, b) => positions.indexOf(a.x) - positions.indexOf(b.x)
            );

            return [{ data: series }];
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
                theme: {
                    mode: isDarkModeEnabled ? 'dark' : 'light'
                }
            };
        }
    },
    mounted() {
        // this.emitter.on('dark-mode-toggle', this.handleDarkModeToggle);
    }
};
</script>
