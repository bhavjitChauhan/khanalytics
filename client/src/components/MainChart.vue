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
        ></apexchart>
    </div>
</template>

<script>
export default {
    name: 'MainChart',
    data: () => ({
        chartOptions: {
            chart: {
                animations: {
                    enabled: false
                },
                id: 'main-chart',
                zoom: {
                    // autoScaleYaxis: true
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
        chartSeries: []
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
        },
        activateRangeButton(id) {
            document
                .querySelectorAll('button')
                .forEach((el) => el.classList.remove('btn-active'));
            document.getElementById(id).classList.add('btn-active');
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
