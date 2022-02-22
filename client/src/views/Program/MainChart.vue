<template>
    <Container
        id="program-main-chart"
        class="relative"
        :height="height"
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
        </InfoButton>
        <div
            v-if="isLegacyProgram"
            class="flex items-center justify-center w-full h-full"
        >
            <span class="font-bold uppercase text-neutral">No data</span>
        </div>
    </Container>
    <button
        class="btn"
        @click="forecast"
    >Forecast</button>
</template>

<script>
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
        }
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

            return series;
        }
    },
    watch: {
        isDarkModeEnabled() {
            console.log('isDarkModeEnabled');
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
        forecast() {
            const series = this.chartSeries;
            if (!series) return null;

            const data = series[1].data;

            worker.postMessage({
                series: data
            });

            worker.onmessage = function (e) {
                console.log('worker: ', e.data);
            };


            // const worker = createInlineWorker(({ timeseries, series }) => {
            //     console.log(JSONfn.parse(timeseries))

            //     self.postMessage('Hello from the worker!');
            // });

            // worker.postMessage({
            //     timeseries: JSONfn.JSONfn.stringify(timeseries),
            //     series
            // });

        }
    },
    mounted() {
        this.emitter.on('dark-mode-toggle', this.handleDarkModeToggle);
    }
};
</script>
