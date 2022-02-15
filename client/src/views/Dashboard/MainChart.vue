<template>
    <Container
        height="auto"
        id="main-chart"
        :style="{'min-height': height}"
    >
        <div
            v-if="chartSeries"
            class="grid grid-cols-2"
        >
            <div
                class="justify-start hidden tabs tabs-boxed w-fit flex-nowrap md:flex"
                style="width: fit-content"
            >
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="rank-tab"
                    @click="handleTabClick"
                >Rank</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110 tab-active"
                    id="votes-tab"
                    @click="handleTabClick"
                >Votes</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="forks-tab"
                    @click="handleTabClick"
                >Forks</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="comments-tab"
                    @click="handleTabClick"
                >Comments</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="commentVotes-tab"
                    @click="handleTabClick"
                >Upvotes</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="replies-tab"
                    @click="handleTabClick"
                >Replies</a>
            </div>
            <div class="justify-end w-full">
                <InfoButton id="main-chart-modal">
                    <p>
                        This chart shows the performance of the current top 10 programs on the Hotlist. To reduce bandwidth, the granularity is reduced to three hour intervals.
                        <br><br>
                        <b>Use the tabs</b> at the top-left of the chart to switch between the different metrics.
                        <br><br>
                        <b>Use the toolbar</b> at the top-right to manipulate the chart. Hover over the icons for more information.
                        <br><br>
                        <b>Save the chart</b> as an image by clicking the &nbsp;
                        <font-awesome-icon icon="bars" /> &nbsp; icon. Currently there is no way of downloading the data from the chart, if you need access to the raw data fill out the contact form linked at the bottom.
                    </p>
                </InfoButton>
            </div>
        </div>
        <apexchart
            v-if="chartSeries"
            width="100%"
            :height="height"
            type="line"
            :options="chartOptions"
            :series="chartSeries"
            @legendClick=handleLegendClick
        ></apexchart>
    </Container>
</template>

<script>
import colorHash from '@/util/colorHash';
import formatDate from '@/util/formatDate';
import { isDarkModeEnabled } from '@/util/darkMode';

import Container from '@/components/Container';
import InfoButton from '@/components/InfoButton';

export default {
    name: 'MainChart',
    components: {
        Container,
        InfoButton
    },
    props: {
        height: String
    },
    data: () => ({
        chartOptions: {
            chart: {
                background: isDarkModeEnabled() ? 'transparent' : '#fff',
                animations: {
                    enabled: false
                },
                id: 'main-chart',
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            grid: {
                borderColor: isDarkModeEnabled() ? '#6b7280' : '#90A4AE'
            },
            legend: {
                onItemClick: {
                    toggleDataSeries: false
                }
            },
            markers: {
                strokeColors: isDarkModeEnabled() ? 'transparent' : '#fff'
            },
            stroke: {
                curve: 'smooth'
            },
            theme: {
                mode: 'dark'
            },
            theme: {
                mode: isDarkModeEnabled() ? 'dark' : 'light'
            },
            tooltip: {
                x: {
                    // show: false,
                    format: 'dd MMM HH:00',
                    formatter: () => null
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false
                },
                title: {
                    text: 'Time'
                },
                tooltip: {
                    enabled: true,
                    format: 'dd MMM HH:00',
                    formatter: (val) => formatDate(val)
                }
            },
            yaxis: {
                reversed: false,
                min: 0,
                forceNiceScale: true
            }
        },
        field: 'votes',
        previousField: null,
        previousLabels: null
    }),
    computed: {
        isDarkModeEnabled() {
            return isDarkModeEnabled();
        },
        performanceTopData() {
            const data = this.$store.state.performanceTopData;
            if (!data.length) return null;
            return this.$store.state.performanceTopData;
        },
        hotlistSnapshot() {
            const data = this.$store.state.hotlistSnapshot;
            if (!Object.keys(data).length) return null;
            return this.$store.state.hotlistSnapshot;
        },
        chartSeries() {
            const performanceTopData = this.performanceTopData;
            const hotlistSnapshot = this.hotlistSnapshot;
            if (!performanceTopData || !hotlistSnapshot) return null;

            const field = this.field;
            const series = [];
            for (const entry of performanceTopData) {
                const data = entry.programs.map((program) => {
                    const date = new Date(program.timestamp);
                    const value = program[field];
                    return [date, value];
                });
                series.push({
                    name: entry.program_id,
                    data: data
                });
            }
            const labels = [];
            // todo: add any programs that squeezed in
            series.map((series) => {
                if (!hotlistSnapshot[series.name]) return;
                if (['rank', 'votes', 'forks'].includes(field)) {
                    series.data.push([
                        new Date(),
                        hotlistSnapshot[series.name][field]
                    ]);
                }
                const title = hotlistSnapshot[series.name].title;
                series.name = title;
                labels.push(title);

                return series;
            });
            if (JSON.stringify(labels) != JSON.stringify(this.previousLabels)) {
                this.updateChartColors(series);
            }
            this.previousLabels = labels;

            return series;
        },
        tabs() {
            const rankTab = document.getElementById('rank-tab');
            const votesTab = document.getElementById('votes-tab');
            const forksTab = document.getElementById('forks-tab');
            const commentsTab = document.getElementById('comments-tab');
            const commentVotesTab = document.getElementById('commentVotes-tab');
            const repliesTab = document.getElementById('replies-tab');

            return [
                rankTab,
                votesTab,
                forksTab,
                commentsTab,
                commentVotesTab,
                repliesTab
            ];
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
        updateChartColors(chartSeries) {
            const colors = chartSeries.map((series) => {
                return colorHash.hex(series.name);
            });
            const previousColors = this.chartOptions.colors;
            if (previousColors != colors) {
                this.chartOptions = {
                    ...this.chartOptions,
                    colors
                };
            }
        },
        handleLegendClick(_chartContext, seriesIndex) {
            const title = this.chartSeries[seriesIndex].name;
            const id = this.$store.getters.getProgramByTitle(title).id;

            if (id)
                this.$router.push({
                    name: 'program',
                    params: { id }
                });
        },
        handleTabClick(e) {
            const field = e.target.id.split('-')[0];
            this.previousField = this.field;
            this.field = field;

            if (field == 'rank' || this.previousField == 'rank') {
                this.chartOptions = {
                    ...this.chartOptions,
                    ...{
                        stroke: {
                            curve:
                                e.target.id == 'rank-tab'
                                    ? 'stepline'
                                    : 'smooth'
                        },
                        yaxis: {
                            reversed: e.target.id == 'rank-tab',
                            min: e.target.id == 'rank-tab' ? 1 : 0,
                            max: e.target.id == 'rank-tab' ? 25 : (max) => max,
                            forceNiceScale: e.target.id != 'rank-tab'
                        }
                    }
                };
            }

            this.tabs.forEach((tab) => tab.classList.remove('tab-active'));
            e.target.classList.add('tab-active');
        }
    },
    mounted() {
        this.emitter.on('dark-mode-toggle', this.handleDarkModeToggle);
    }
};
</script>
