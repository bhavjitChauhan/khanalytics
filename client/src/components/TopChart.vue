<template>
    <div class="flex flex-col h-full p-5 space-y-4 rounded shadow-lg">
        <div class="grid grid-cols-2">
            <div class="justify-start w-full">
                <select
                    class="w-1/3 select select-bordered"
                    @change="handleSelectChange"
                >
                    <option
                        value="votes"
                        selected
                    >Votes</option>
                    <option value="forks">Forks</option>
                </select>
            </div>
            <div class="justify-end w-full">
                <label
                    for="top-chart-modal"
                    class="float-right btn btn-sm btn-circle btn-outline modal-button"
                >
                    <font-awesome-icon icon="info" />
                </label>
                <input
                    type="checkbox"
                    id="top-chart-modal"
                    class="modal-toggle"
                >
                <div class="modal">
                    <div class="modal-box">
                        <p>
                            The pie chart shows distribution of a metric across the top 100 programs on the Hotlist. Programs with less than 1% of the total are shown as the "Other" category.
                            <br><br>
                            <b>Select other metrics</b> at the top-left of the chart.
                        </p>
                        <div class="modal-action">
                            <label
                                for="top-chart-modal"
                                class="btn btn-sm"
                            >Close</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <apexchart
            v-if="chartSeries.length > 0"
            type="pie"
            width="100%"
            :options="chartOptions"
            :series="chartSeries"
            @legendClick=handleLegendClick
        ></apexchart>
    </div>
</template>

<script>
import colorHash from '../util/colorHash';
import truncate from '../util/truncate';

export default {
    name: 'TopChart',
    data: () => ({
        chartOptions: {
            chart: {
                animations: {
                    enabled: false
                },
                id: 'top-chart',
                type: 'pie'
            },
            labels: [],
            legend: {
                formatter: (seriesName) => truncate(seriesName, 32),
                onItemClick: {
                    toggleDataSeries: false
                }
            }
        },
        chartSeries: []
    }),
    methods: {
        prepareData(field = 'votes') {
            const hotlistSnapshot = this.$parent.hotlistSnapshot;

            let programs = Object.values(hotlistSnapshot).map((program) => {
                return {
                    label: program.title,
                    value: program[field],
                    color: colorHash.hex(program.title)
                };
            });
            const fieldTotal = programs.reduce(
                (total, entry) => total + entry.value,
                0
            );
            let excludedTotal = 0;

            programs = programs
                .filter((program) => {
                    if (program.value / fieldTotal <= 0.01) {
                        excludedTotal += program.value;
                        return false;
                    }
                    return true;
                })
                .sort((a, b) => b.value - a.value);

            if (excludedTotal > 0) {
                programs.push({
                    label: 'Other',
                    value: excludedTotal,
                    color: '#808080'
                });
            }

            this.chartOptions = {
                ...this.chartOptions,
                labels: programs.map((program) => program.label),
                colors: programs.map((program) => program.color)
            };
            this.chartSeries = programs.map((entry) => entry.value);
        },
        handleLegendClick(chartContext, seriesIndex) {
            const label = chartContext.w.config.labels[seriesIndex];

            const entries = Object.entries(this.$parent.hotlistSnapshot);
            const index = entries.findIndex((entry) => entry[1].title == label);
            const id = entries[index][0];

            const BASE_URL = 'https://khanacademy.org/cs/-/';
            const url = BASE_URL + id;

            window.open(url, '_blank');
        },
        handleSelectChange(event) {
            this.prepareData(event.target.value);
        }
    },
    mounted() {
        this.emitter.on('hotlist-snapshot', this.prepareData);
    }
};
</script>
