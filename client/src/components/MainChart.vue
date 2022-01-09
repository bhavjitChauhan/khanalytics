<template>
    <div class="p-5 rounded shadow-lg">
        <div class="grid grid-cols-2">
            <div class="justify-start w-full tabs tabs-boxed">
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
            <div class="justify-end w-full tabs tabs-boxed">
                <!-- <a class="tab">Month</a> -->
                <a class="tab tab-active">Week</a>
                <!-- <a class="tab">Day</a> -->
                <!-- <a class="tab">Hour</a> -->
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
                    autoScaleYaxis: true
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
                title: {
                    text: 'Votes'
                }
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
