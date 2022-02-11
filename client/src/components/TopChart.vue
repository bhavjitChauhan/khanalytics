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
            @dataPointSelection=handleDataPointSelection
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
                height: '100%',
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
        field: 'votes'
    }),
    computed: {
        chartSeries() {
            const hotlistSnapshot = this.$store.state.hotlistSnapshot;
            if (!hotlistSnapshot) return null;
            const field = this.field;

            const labels = [];
            let programs = Object.values(hotlistSnapshot).map((program) => {
                const label = program.title;
                return {
                    label: label,
                    value: program[field],
                    color: colorHash.hex(label)
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

            return programs.map((entry) => entry.value);
        }
    },
    methods: {
        handleLegendClick(_chartContext, seriesIndex) {
            const title = this.chartOptions.labels[seriesIndex];
            const id = this.$store.getters.getProgramByTitle(title).id;
            
            if (id) window.open(`https://khanacademy.org/cs/-/${id}`, '_blank');
        },
        handleDataPointSelection(_event, _chartContext, { dataPointIndex }) {
            const title = this.chartOptions.labels[dataPointIndex];
            const id = this.$store.getters.getProgramByTitle(title).id;
            
            if (id) window.open(`https://khanacademy.org/cs/-/${id}`, '_blank');
        },
        handleSelectChange(event) {
            this.field = event.target.value;
        }
    }
};
</script>
