<template>
    <div class="flex flex-col h-full p-5 space-y-4 rounded ring-offset-2 ring-1 ring-gray-200">
        <div class="grid grid-cols-2">
            <div class="justify-start w-full">
                <select
                    id="fieldSelectA"
                    class="w-1/3 select select-bordered"
                    @change="handleSelectChange"
                >
                    <option value="rank">Rank</option>
                    <option
                        value="votes"
                        disabled
                    >Votes</option>
                    <option
                        value="forks"
                        selected
                    >Forks</option>
                </select>
                <span>&nbsp; vs &nbsp;</span>
                <select
                    id="fieldSelectB"
                    class="w-1/3 select select-bordered"
                    @change="handleSelectChange"
                >
                    <option value="rank">Rank</option>
                    <option
                        value="votes"
                        selected
                    >Votes</option>
                    <option
                        value="forks"
                        disabled
                    >Forks</option>
                </select>
            </div>
            <div class="justify-end w-full">
                <InfoButton id="ratio-chart-modal">
                    <p>
                        The ratio chart shows the corelation between the two metrics. The top 100 programs from the Hotlist are plotted.
                        <br><br>
                        <b>Select other metrics</b> at the top-left of the chart. You cannot select the same metric twice.
                        <br><br>
                        <b>Use the toolbar</b> at the top-right to manipulate the chart. Hover over the icons for more information.
                        <br><br>
                        <b>Save the chart</b> as an image by clicking the &nbsp;
                        <font-awesome-icon icon="bars" /> &nbsp; icon. Currently there is no way of downloading the data from the chart, if you need access to the raw data please contact me.
                    </p>
                </InfoButton>
            </div>
        </div>
        <apexchart
            v-if="chartSeries.length > 0"
            type="scatter"
            width="100%"
            :options="chartOptions"
            :series="chartSeries"
            @legendClick=handleLegendClick
            @dataPointSelection=handleDataPointSelection
        ></apexchart>
    </div>
</template>

<script>
import colorHash from '@/util/colorHash';
import toTitleCase from '@/util/toTitleCase';
import truncate from '@/util/truncate';

import InfoButton from '@/components/InfoButton';

export default {
    name: 'RatioChart',
    components: {
        InfoButton
    },
    data: () => ({
        chartOptions: {
            chart: {
                animations: {
                    enabled: false
                },
                height: '100%',
                id: 'ratio-chart',
                toolbar: {
                    autoSelected: 'pan'
                },
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            legend: {
                position: 'right',
                formatter: (seriesName) => truncate(seriesName, 32),
                onItemClick: {
                    toggleDataSeries: false
                }
            },
            tooltip: {
                x: {
                    show: false
                },
                y: {
                    formatter: () => null
                },
                marker: {
                    show: false
                }
            },
            xaxis: {
                reversed: false,
                tickAmount: 10,
                min: 0,
                max: (max) => max,
                title: {
                    text: 'Votes'
                }
            },
            yaxis: {
                reversed: false,
                tickAmount: 10,
                min: 0,
                max: (max) => max,
                forceNiceScale: true,
                title: {
                    text: 'Forks'
                },
                tooltip: {
                    enabled: true
                }
            }
        },
        selectedFields: ['forks', 'votes']
    }),
    computed: {
        chartSeries() {
            const hotlistSnapshot = this.$store.state.hotlistSnapshot;
            if (!hotlistSnapshot) return null;

            const [fieldA, fieldB] = this.selectedFields;

            const series = [];

            Object.values(hotlistSnapshot).forEach((program) => {
                series.push({
                    name: program.title,
                    data: [[program[fieldB], program[fieldA]]]
                });
            });

            const colors = series.map((series) => {
                return colorHash.hex(series.name);
            });

            this.chartOptions = {
                ...this.chartOptions,
                colors: colors,
                xaxis: {
                    ...this.chartOptions.xaxis,
                    reversed: fieldB == 'rank',
                    min: fieldB == 'rank' ? 1 : 0,
                    max: fieldB == 'rank' ? 100 : (max) => max,
                    title: {
                        text: toTitleCase(fieldB)
                    }
                },
                yaxis: {
                    ...this.chartOptions.yaxis,
                    reversed: fieldA == 'rank',
                    max: fieldA == 'rank' ? 100 : (max) => max,
                    min: fieldA == 'rank' ? 1 : 0,
                    forceNiceScale: fieldA != 'rank',
                    title: {
                        text: toTitleCase(fieldA)
                    }
                }
            };

            return series;
        }
    },
    methods: {
        handleLegendClick(_chartContext, seriesIndex) {
            const title = this.chartSeries[seriesIndex].name;
            const id = this.$store.getters.getProgramByTitle(title).id;

            if (id)
                this.$router.push({
                    name: 'program',
                    params: { id }
                });
        },
        handleDataPointSelection(_event, _chartContext, { seriesIndex }) {
            const title = this.chartSeries[seriesIndex].name;
            const id = this.$store.getters.getProgramByTitle(title).id;

            if (id)
                this.$router.push({
                    name: 'program',
                    params: { id }
                });
        },
        handleSelectChange(_event) {
            const fieldSelectA = document.getElementById('fieldSelectA');
            const fieldSelectB = document.getElementById('fieldSelectB');

            const fieldA = fieldSelectA.value;
            const fieldB = fieldSelectB.value;
            this.selectedFields = [fieldA, fieldB];

            const fieldSelectAOptions =
                fieldSelectA.getElementsByTagName('option');
            const fieldSelectBOptions =
                fieldSelectB.getElementsByTagName('option');
            for (const option of fieldSelectAOptions) {
                option.disabled = option.value == fieldB;
            }
            for (const option of fieldSelectBOptions) {
                option.disabled = option.value == fieldA;
            }
        }
    }
};
</script>
