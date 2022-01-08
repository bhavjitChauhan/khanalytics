<template>
    <div class="p-5 rounded shadow-lg">
        <div class="tabs tabs-boxed">
            <a
                class="tab"
                id="rank-tab"
            >Rank</a>
            <a
                class="tab tab-active"
                id="votes-tab"
            >Votes</a>
            <a
                class="tab"
                id="forks-tab"
            >Forks</a>
        </div>
        <!-- <div class="btn-group">
            <button
                class="btn btn-outline"
                id="twelve-hours"
            >12H</button>
            <button
                class="btn btn-outline"
                id="one-day"
            >1D</button>
            <button
                class="btn btn-outline btn-active"
                id="one-week"
            >1W</button>
        </div> -->
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
import api from '@/services/api';

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
                    autoSelected: 'pan'
                },
                zoom: {
                    // autoScaleYaxis: true
                }
            },
            legend: {
                onItemClick: {
                    toggleDataSeries: false
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false
                }
            },
            yaxis: {
                reversed: false
            },
            tooltip: {
                x: {
                    show: false
                    // format: 'dd MMM HH:00'
                }
            }
        },
        chartSeries: [],
        mappings: {}
    }),
    methods: {
        prepareData(values = 'votes') {
            const hotlistData = this.$parent.hotlistData;

            const series = [];
            for (const entry of hotlistData) {
                const data = entry.programs.map((program) => {
                    const date = new Date(program.timestamp);
                    const value = program[values];
                    return [date, value];
                });
                series.push({
                    name: entry._id,
                    data: data
                });
            }

            this.chartSeries = series;
            if (Object.keys(this.mappings).length == 0)
                this.fetchProgramsData();
            else {
                const series = this.chartSeries;
                series.map((series) => {
                    series.name = this.mappings[series.name];
                    return series;
                });
                this.chartSeries = series;
            }
        },
        async fetchProgramsData() {
            const MAX_TITLE_LENGTH = 32;

            const ids = this.chartSeries.map((series) => series.name);
            const titles = [];

            for (const id of ids) {
                await api
                    .fetchProgramData(
                        `scratchpads/${id}?projection={"title":1}`
                    )
                    .then((program) => {
                        let title = program.title;
                        if (title.length > MAX_TITLE_LENGTH) {
                            title =
                                title.substring(0, MAX_TITLE_LENGTH - 3) +
                                '...';
                        }
                        titles.push(title);
                    });
            }

            const series = this.chartSeries;
            series.map((series, i) => {
                series.name = titles[i];
                return series;
            });
            this.chartSeries = series;

            this.mappings = titles.reduce(
                (obj, k, i) => ({ ...obj, [k]: ids[i] }),
                {}
            );
        },
        handleLegendClick(_chartContext, seriesIndex) {
            const BASE_URL = 'https://khanacademy.org/cs/-/';
            const url = BASE_URL + Object.values(this.mappings)[seriesIndex];
            window.open(url, '_blank');
        }
    },
    mounted() {
        this.emitter.on('hotlist-data', this.prepareData);
        const rankTab = document.getElementById('rank-tab');
        const votesTab = document.getElementById('votes-tab');
        const forksTab = document.getElementById('forks-tab');
        const tabs = [rankTab, votesTab, forksTab];
        tabs.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                tabs.forEach((tab) => tab.classList.remove('tab-active'));
                e.target.classList.add('tab-active');
                this.prepareData(e.target.id.split('-')[0]);
                this.chartOptions = {
                    ...this.chartOptions,
                    ...{
                        yaxis: {
                            reversed: e.target.id == 'rank-tab'
                        }
                    }
                };
            });
        });
    }
};
</script>
