<template>
    <Container
        height="auto"
        class="flex flex-col h-full p-5 space-y-4"
        :style="{'min-height': height}"
    >
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
                <InfoButton id="top-chart-modal">
                    <p>
                        The pie chart shows distribution of a metric across the top 100 programs on the Hotlist. Programs with less than 1% of the total are shown as the "Other" category.
                        <br><br>
                        <b>Select other metrics</b> at the top-left of the chart.
                    </p>
                </InfoButton>
            </div>
        </div>
        <apexchart
            v-if="chartSeries.length > 0"
            type="pie"
            width="100%"
            :height="height"
            :options="chartOptions"
            :series="chartSeries"
            @legendClick=handleLegendClick
            @dataPointSelection=handleDataPointSelection
        ></apexchart>
    </Container>
</template>

<script>
import colorHash from '@/util/colorHash';
import truncate from '@/util/truncate';
import { isDarkModeEnabled } from '@/util/darkMode';

import Container from '@/components/Container';
import InfoButton from '@/components/InfoButton';

export default {
    name: 'TopChart',
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
                animations: {
                    enabled: false
                },
                background: isDarkModeEnabled() ? 'transparent' : '#fff',
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
            },
            stroke: {
                colors: [isDarkModeEnabled() ? '#6b7280' : '#fff']
            },
            theme: {
                mode: isDarkModeEnabled() ? 'dark' : 'light'
            }
        },
        field: 'votes'
    }),
    computed: {
        isDarkModeEnabled() {
            return isDarkModeEnabled();
        },
        chartSeries() {
            const hotlistSnapshot = this.$store.state.hotlistSnapshot;
            if (!hotlistSnapshot) return null;
            const field = this.field;

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
        handleDarkModeToggle(isDarkModeEnabled) {
            this.chartOptions = {
                ...this.chartOptions,
                chart: {
                    ...this.chartOptions.chart,
                    background: isDarkModeEnabled ? 'transparent' : '#fff'
                },
                stroke: {
                    colors: [isDarkModeEnabled ? '#6b7280' : '#fff']
                },
                theme: {
                    mode: isDarkModeEnabled ? 'dark' : 'light'
                }
            };
        },
        handleLegendClick(_chartContext, seriesIndex) {
            const title = this.chartOptions.labels[seriesIndex];
            const id = this.$store.getters.getProgramByTitle(title).id;

            if (id)
                this.$router.push({
                    name: 'program',
                    params: { id }
                });
        },
        handleDataPointSelection(_event, _chartContext, { dataPointIndex }) {
            const title = this.chartOptions.labels[dataPointIndex];
            const id = this.$store.getters.getProgramByTitle(title).id;

            if (id)
                this.$router.push({
                    name: 'program',
                    params: { id }
                });
        },
        handleSelectChange(event) {
            this.field = event.target.value;
        }
    },
    mounted() {
        this.emitter.on('dark-mode-toggle', this.handleDarkModeToggle);
    }
};
</script>
