<template>
    <Container
        :height="height"
        class="relative"
    >
        <apexchart
            v-if="chartSeries"
            width="100%"
            height="100%"
            type="radar"
            :options="chartOptions"
            :series="chartSeries"
        ></apexchart>
        <InfoButton
            v-if="chartSeries"
            id="radar-chart-modal"
            :corner="true"
        >
            <p>
                This chart shows how well the current program stacks up to the user's top 10 programs. This information is useful to see if the program is doing well in certain areas.
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
    name: 'RadarChart',
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
                id: 'radar-main-chart'
            },
            markers: {
                strokeColors: isDarkModeEnabled ? 'transparent' : '#fff'
            },
            theme: {
                mode: isDarkModeEnabled() ? 'dark' : 'light'
            },
            tooltip: {
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return '';
                        }
                    }
                },
                marker: {
                    show: false
                }
            },
            xaxis: {
                categories: ['Votes', 'Forks', 'Comments', 'Upvotes', 'Replies']
            },
            yaxis: {
                tickAmount: 2,
                min: 0,
                max: 100,
                labels: {
                    formatter: (val) => Math.round(val) + '%'
                }
            }
        }
    }),
    computed: {
        isDarkModeEnabled() {
            return isDarkModeEnabled();
        },
        performance: function () {
            return this.$parent.performance;
        },
        userTopProgramsData() {
            return this.$parent.userTopProgramsData;
        },
        userTopProgramsDiscussions() {
            return this.$parent.userTopProgramsDiscussions;
        },
        chartSeries() {
            const performance = this.performance;
            const userTopProgramsData = this.userTopProgramsData;
            const userTopProgramsDiscussions = this.userTopProgramsDiscussions;
            if (
                !performance ||
                !userTopProgramsData ||
                !userTopProgramsDiscussions
            )
                return null;

            const latestPerformance = performance[performance.length - 1];
            const series = [];
            const topVotes =
                latestPerformance.votes /
                Math.max(...userTopProgramsData.map(({ votes }) => votes));
            const topForks =
                latestPerformance.forks /
                Math.max(...userTopProgramsData.map(({ forks }) => forks));
            const topComments =
                latestPerformance.comments /
                Math.max(
                    ...userTopProgramsDiscussions.map(
                        ({ comments }) => comments
                    )
                );
            const topUpvotes =
                latestPerformance.commentVotes /
                Math.max(
                    ...userTopProgramsDiscussions.map(
                        ({ commentVotes }) => commentVotes
                    )
                );
            const topReplies =
                latestPerformance.replies /
                Math.max(
                    ...userTopProgramsDiscussions.map(({ replies }) => replies)
                );

            series.push({
                data: [
                    topVotes * 100,
                    topForks * 100,
                    topComments * 100 || 0,
                    topUpvotes * 100 || 0,
                    topReplies * 100 || 0
                ]
            });

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
                markers: {
                    strokeColors: isDarkModeEnabled ? 'transparent' : '#fff'
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
