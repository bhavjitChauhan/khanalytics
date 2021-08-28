<template>
    <div class="p-5 mx-32">
        <h1 class="text-4xl font-bold">Dashboard</h1>
        <apexchart
            width="75%"
            type="line"
            :options="chartOptions"
            :series="chartSeries"
            v-if="hotlistData"
        ></apexchart>
    </div>
</template>

<script>
export default {
    name: 'Dashboard',
    props: {
        hotlistData: Array
    },
    data: () => ({
        chartOptions: {
            chart: {
                id: 'vuechart-example'
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false
                }
            }
        },
        chartSeries: []
    }),
    methods: {
        prepareData() {
            const topProgramIDs = new Set(
                this.hotlistData
                    .filter((program) => program.rank <= 3)
                    .map((program) => program.program_id)
            );
            const programs = this.hotlistData
                .filter((program) => topProgramIDs.has(program.program_id))
                .map((program) => {
                    program.timestamp = new Date(program.timestamp);
                    return program;
                });
            const series = [];
            topProgramIDs.forEach((id) => {
                const data = [];
                for (const program of programs.filter(
                    (program) => program.program_id == id
                )) {
                    data.push([program.timestamp, program.votes]);
                }
                series.push({
                    name: id,
                    data: data
                });
            });
            this.chartSeries = series;

            console.log(programs);
        }
    },
    watch: {
        hotlistData: {
            handler: function () {
                this.prepareData();
            }
        }
    }
};
</script>
