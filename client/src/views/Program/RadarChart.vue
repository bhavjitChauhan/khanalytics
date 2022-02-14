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
            xaxis: {
                categories: ['Votes', 'Forks', 'Comments', 'Upvotes', 'Replies']
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
            if (!performance || !userTopProgramsData) return null;
            const userTopProgramsDiscussions = this.userTopProgramsDiscussions;

            const latestPerformance = performance[performance.length - 1];
            const series = [];
            const topVotes =
                latestPerformance.votes /
                Math.max(...userTopProgramsData.map(({ votes }) => votes));
            const topForks =
                latestPerformance.forks /
                Math.max(...userTopProgramsData.map(({ forks }) => forks));
            if (userTopProgramsDiscussions) {
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
                        ...userTopProgramsDiscussions.map(
                            ({ replies }) => replies
                        )
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
            } else {
                series.push({
                    data: [topVotes * 100, topForks * 100, 0, 0, 0]
                });
            }

            return series;
        }
    }
};
</script>
