<template>
    <div class="p-5 rounded shadow">
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
            tooltip: {
                x: {
                    format: 'dd MMM HH:00'
                }
            }
        },
        chartSeries: []
    }),
    methods: {
        prepareData() {
            const hotlistData = this.$parent.hotlistData;

            // const topProgramIDs = new Set(
            //     data
            //         .filter((program) => program.rank <= 1)
            //         .map((program) => program.program_id)
            // );
            // const programs = data
            //     .filter((program) => topProgramIDs.has(program.program_id))
            //     .map((program) => {
            //         program.timestamp = new Date(program.timestamp);
            //         return program;
            //     });
            // const series = [];
            // topProgramIDs.forEach((id) => {
            //     const data = [];
            //     for (const program of programs.filter(
            //         (program) => program.program_id == id
            //     )) {
            //         data.push([program.timestamp, program.votes]);
            //     }
            //     series.push({
            //         name: id,
            //         data: data
            //     });
            // });

            const series = [];
            for (const entry of hotlistData) {
                const data = entry.programs.map((program) => {
                    const date = new Date(program.timestamp);
                    const votes = program.votes;
                    return [date, votes];
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
        this.emitter.on('hotlist-data', () => {
            this.prepareData();
        });
        // document
        //     .getElementById('twelve-hours')
        //     .addEventListener('click', (e) => {
        //         ApexCharts.exec(
        //             'main-chart',
        //             'zoomX',
        //             Date.now() - 1000 * 60 * 60 * 12,
        //             Date.now()
        //         );
        //         this.activateRangeButton('twelve-hours');
        //     });
        // document.getElementById('one-day').addEventListener('click', (e) => {
        //     ApexCharts.exec(
        //         'main-chart',
        //         'zoomX',
        //         Date.now() - 1000 * 60 * 60 * 24,
        //         Date.now()
        //     );
        //     this.activateRangeButton('one-day');
        // });
        // document.getElementById('one-week').addEventListener('click', (e) => {
        //     ApexCharts.exec(
        //         'main-chart',
        //         'zoomX',
        //         Date.now() - 1000 * 60 * 60 * 24 * 7,
        //         Date.now()
        //     );
        //     this.activateRangeButton('one-week');
        // });
    }
};
</script>
