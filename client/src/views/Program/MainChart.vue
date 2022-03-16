<template>
    <Container
        id="program-main-chart"
        class="relative"
    >
        <apexchart
            v-if="chartSeries"
            width="100%"
            height="100%"
            type="line"
            :options="chartOptions"
            :series="chartSeries"
            @mounted="this.$window.ApexCharts.exec('program-main-chart', 'hideSeries', 'Rank')"
        ></apexchart>

        <div
            v-if="chartSeries"
            class="hidden float-right mt-2 mb-4 space-x-1 min-w-min md:block"
        >
            <input
                type="number"
                placeholder="Hours"
                title="Hours to predict"
                :value="forecastInput"
                id="forecast-input"
                class="w-16 input input-bordered input-sm"
                @change="event => forecastInput = event.target.value"
            >
            <button
                id="forecast-btn"
                class="btn btn-sm"
                :class="{ loading: forecasting }"
                @click="forecast"
            >
                Forecast
            </button>
            <button
                id="reset-btn"
                class="inline-flex btn btn-sm btn-outline"
                @click="reset"
            >
                Reset
            </button>
        </div>

        <InfoButton
            v-if="chartSeries"
            id="program-main-chart-modal"
            :corner="true"
        >
            <p>
                This chart shows the performance of the current program while it is in the top 100 on the Hotlist.
            </p>
            <br>
            <p>
                <b>Use the toolbar</b> at the top-right to manipulate the chart. Hover over the icons for more information.
            </p>
            <br>
            <p>
                <b>Toggle metrics</b> shown on the chart by clicking on the legend at the botton of the chart.
            </p>
            <br>
            <p>
                <b>Download the data</b> or save the chart as an image by clicking the &nbsp;
                <font-awesome-icon icon="bars" /> &nbsp; icon.
            </p>
            <div class="uppercase divider">Beta</div>
            <p>
                <b>Forecast</b> the performance of the program by entering the number of hours to predict.
            </p>
        </InfoButton>
        <div
            v-if="isPredatingProgram"
            class="flex items-center justify-center w-full h-full"
        >
            <span class="font-bold uppercase text-neutral">No data</span>
        </div>
    </Container>
</template>

<script>
import gtag from 'vue-gtag';

import worker from '@/workers/forecast';
import { isDarkModeEnabled } from '@/util/darkMode';

import Container from '@/components/Container.vue';
import InfoButton from '@/components/InfoButton.vue';

export default {
    name: 'MainChart',
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
                background: isDarkModeEnabled() ? 'transparent' : '#fff',
                id: 'program-main-chart',
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            grid: {
                borderColor: isDarkModeEnabled() ? '#6b7280' : '#90A4AE'
            },
            markers: {
                strokeColors: isDarkModeEnabled() ? 'transparent' : '#fff'
            },
            stroke: {
                curve: [
                    'stepline',
                    'smooth',
                    'smooth',
                    'smooth',
                    'smooth',
                    'smooth'
                ]
            },
            theme: {
                mode: isDarkModeEnabled() ? 'dark' : 'light'
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false
                },
                title: {
                    text: 'Time'
                }
            },
            yaxis: [
                {
                    seriesName: 'Rank',
                    opposite: true,
                    reversed: true,
                    tickAmount: 10,
                    min: 1,
                    max: (max) => max,
                    labels: {
                        formatter: (val) => parseInt(val, 10)
                    },
                    title: {
                        text: 'Rank'
                    }
                },
                {
                    seriesName: 'Votes',
                    forceNiceScale: true,
                    labels: {
                        formatter: (val) => parseInt(val, 10)
                    }
                },
                {
                    seriesName: 'Votes',
                    show: false,
                    labels: {
                        formatter: (val) => parseInt(val, 10)
                    }
                },
                {
                    seriesName: 'Votes',
                    show: false,
                    labels: {
                        formatter: (val) => parseInt(val, 10)
                    }
                },
                {
                    seriesName: 'Votes',
                    show: false,
                    labels: {
                        formatter: (val) => parseInt(val, 10)
                    }
                },
                {
                    seriesName: 'Votes',
                    show: false,
                    labels: {
                        formatter: (val) => parseInt(val, 10)
                    }
                }
            ],
            tooltip: {
                x: {
                    show: false,
                    format: 'dd MMM HH:00'
                }
            }
        },
        forecastInput: 10,
        forecasting: false,
        forecastProgress: null,
        resetKey: false
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
        chartSeries() {
            const performance = this.performance;
            if (!performance) return null;

            this.resetKey = !this.resetKey;
            const series = [];
            const labels = [
                ['rank', 'Rank'],
                ['votes', 'Votes'],
                ['forks', 'Forks'],
                ['comments', 'Comments'],
                ['commentVotes', 'Upvotes'],
                ['replies', 'Replies']
            ];
            for (const label of labels) {
                series.push({
                    name: label[1],
                    data: performance.map((element) => [
                        element.timestamp,
                        element[label[0]]
                    ])
                });
            }

            const annotations = [];
            const data = series[1].data;
            let previousTimestamp = data[0][0];
            for (const i in data) {
                const timestamp = data[i][0];
                const difference = timestamp - previousTimestamp;

                if (difference > 1000 * 60 * 60 * 2) {
                    annotations.push({
                        x: previousTimestamp,
                        x2: timestamp,
                        opacity: 0.1,
                        fillColor: '#f00',
                        label: {
                            text: 'Hidden',
                            borderWidth: 0,
                            style: {
                                background: 'rgba(255, 0, 0, 0.1)'
                            }
                        }
                    });
                }

                previousTimestamp = timestamp;
            }
            this.chartOptions = {
                ...this.chartOptions,
                annotations: {
                    xaxis: annotations
                }
            };

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
                grid: {
                    ...this.chartOptions.grid,
                    borderColor: isDarkModeEnabled ? '#6b7280' : '#90A4AE'
                },
                markers: {
                    strokeColors: isDarkModeEnabled ? 'transparent' : '#fff'
                },
                theme: {
                    mode: isDarkModeEnabled ? 'dark' : 'light'
                }
            };
        },
        async forecast() {
            const performance = this.performance;
            const chartSeries = this.chartSeries;
            const forecastInput = this.forecastInput;
            if (!performance || !chartSeries || !forecastInput) return null;
            if (forecastInput < 1) return null;

            this.forecasting = true;
            this.forecastProgress = 0;

            for (const i in chartSeries) {
                const series = chartSeries[i];

                worker.postMessage({
                    series: series.data,
                    name: series.name,
                    n: forecastInput
                });
            }

            const that = this;
            worker.onmessage = async function (e) {
                const data = e.data;
                const pred = data[1];
                const index = chartSeries.findIndex(
                    (series) => series.name == data[0]
                );
                const series = chartSeries[index];

                const lastTimestamp = series.data[series.data.length - 1][0];

                const formattedData = pred.map((val, i) => [
                    lastTimestamp + (i + 1) * 1000 * 60 * 60,
                    val
                ]);

                chartSeries[index].data = [...series.data, ...formattedData];
                that.forecastProgress += 1 / 6;

                if (
                    chartSeries
                        .map((series) => series.data.length)
                        .every((data, _, arr) => data == arr[0])
                ) {
                    await window.ApexCharts.exec(
                        'program-main-chart',
                        'updateSeries',
                        chartSeries
                    );
                    await window.ApexCharts.exec(
                        'program-main-chart',
                        'updateOptions',
                        {
                            forecastDataPoints: {
                                count:
                                    chartSeries[0].data.length -
                                    performance.length
                            }
                        }
                    );

                    that.forecasting = false;
                    this.forecastProgress = null;
                }
            };

            gtag.event('forecast', { value: forecastInput });
        },
        async reset() {
            this.resetKey = !this.resetKey;
            await window.ApexCharts.exec(
                'program-main-chart',
                'updateOptions',
                {
                    forecastDataPoints: {
                        count: 0
                    }
                }
            );
            await window.ApexCharts.exec(
                'program-main-chart',
                'hideSeries',
                'Rank'
            );
        }
    },
    mounted() {
        // this.emitter.on('dark-mode-toggle', this.handleDarkModeToggle);
    },
    updated() {
        const series = this.chartSeries;
        if (!series) return null;

        window.ApexCharts.exec('program-main-chart', 'clearAnnotation');
        const data = series[1].data;
        let previousTimestamp = data[0][0];
        for (const i in data) {
            const timestamp = data[i][0];
            const difference = timestamp - previousTimestamp;

            if (difference > 1000 * 60 * 60 * 2) {
                window.ApexCharts.exec(
                    'program-main-chart',
                    'addXaxisAnnotation',
                    {
                        x: previousTimestamp,
                        x2: timestamp,
                        opacity: 0.1,
                        fillColor: '#f00',
                        label: {
                            text: 'Hidden'
                        }
                    }
                );
            }

            previousTimestamp = timestamp;
        }
    }
};
</script>
