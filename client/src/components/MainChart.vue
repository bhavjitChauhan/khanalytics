<template>
    <div
        class="p-5 rounded shadow-lg"
        id="main-chart"
    >
        <div class="grid grid-cols-2">
            <div class="justify-start w-full tabs tabs-boxed">
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="rank-tab"
                >Rank</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110 tab-active"
                    id="votes-tab"
                >Votes</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="forks-tab"
                >Forks</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="comments-tab"
                >Comments</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="commentVotes-tab"
                >Upvotes</a>
                <a
                    class="transition-transform ease-in-out tab hover:scale-110"
                    id="replies-tab"
                >Replies</a>
            </div>
            <div class="justify-end w-full">
                <label
                    for="main-chart-modal"
                    class="float-right btn btn-sm btn-circle btn-outline modal-button"
                >
                    <font-awesome-icon icon="info" />
                </label>
                <input
                    type="checkbox"
                    id="main-chart-modal"
                    class="modal-toggle"
                >
                <div class="modal">
                    <div class="modal-box">
                        <p>
                            This chart shows the performance of the current top 10 programs on the Hotlist. To reduce bandwidth, the granularity is reduced to three hour intervals.
                            <br><br>
                            <b>Use the tabs</b> at the top-left of the chart to switch between the different metrics.
                            <br><br>
                            <b>Use the toolbar</b> at the top-right to manipulate the chart. Hover over the icons for more information.
                            <br><br>
                            <b>Save the chart</b> as an image by clicking the &nbsp;
                            <font-awesome-icon icon="bars" /> &nbsp; icon. Currently there is no way of downloading the data from the chart, if you need access to the raw data please contact me.
                        </p>
                        <div class="modal-action">
                            <label
                                for="main-chart-modal"
                                class="btn btn-sm"
                            >Close</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <apexchart
            width="100%"
            height="500px"
            type="line"
            :options="chartOptions"
            :series="chartSeries"
            @legendClick=handleLegendClick
        ></apexchart>
    </div>
</template>

<script>
import colorHash from '../util/colorHash';

export default {
    name: 'MainChart',
    data: () => ({
        chartOptions: {
            chart: {
                animations: {
                    enabled: false
                },
                id: 'main-chart',
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            legend: {
                onItemClick: {
                    toggleDataSeries: false
                }
            },
            stroke: {
                curve: 'smooth'
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
            yaxis: {
                reversed: false,
                min: 0,
                forceNiceScale: true,
                title: {
                    text: 'Votes'
                }
            },
            tooltip: {
                x: {
                    show: false,
                    format: 'dd MMM HH:00'
                }
            }
        },
        chartSeries: []
    }),
    methods: {
        prepareData(field = 'votes') {
            const performanceTopData = this.$parent.performanceTopData;
            const hotlistSnapshot = this.$parent.hotlistSnapshot;

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
            series.map((series) => {
                if (!hotlistSnapshot[series.name]) return;
                if (['rank', 'votes', 'forks'].includes(field)) {
                    series.data.push([
                        new Date(),
                        hotlistSnapshot[series.name][field]
                    ]);
                }
                series.name = hotlistSnapshot[series.name].title;
                return series;
            });

            const colors = series.map((series) => {
                return colorHash.hex(series.name);
            });

            this.chartSeries = series;
            this.chartOptions = {
                ...this.chartOptions,
                colors
            };
        },
        handleLegendClick(_chartContext, seriesIndex) {
            const BASE_URL = 'https://khanacademy.org/cs/-/';
            const url = BASE_URL + Object.keys(hotlistSnapshot)[seriesIndex];
            window.open(url, '_blank');
        }
    },
    mounted() {
        this.emitter.on('performance-top-data', this.prepareData);
        const rankTab = document.getElementById('rank-tab');
        const votesTab = document.getElementById('votes-tab');
        const forksTab = document.getElementById('forks-tab');
        const commentsTab = document.getElementById('comments-tab');
        const commentVotesTab = document.getElementById('commentVotes-tab');
        const repliesTab = document.getElementById('replies-tab');

        const tabs = [
            rankTab,
            votesTab,
            forksTab,
            commentsTab,
            commentVotesTab,
            repliesTab
        ];
        tabs.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                tabs.forEach((tab) => tab.classList.remove('tab-active'));
                e.target.classList.add('tab-active');
                this.prepareData(e.target.id.split('-')[0]);
                let title = e.target.id.split('-')[0];
                title = title.charAt(0).toUpperCase() + title.slice(1);
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
                            forceNiceScale: e.target.id != 'rank-tab',
                            title: {
                                text: title
                            }
                        }
                    }
                };
            });
        });
    }
};
</script>
