<template>
    <div class="p-5">
        <div class="w-full shadow stats">
            <Metric
                title="Unique Programs"
                tooltip="Number of programs that were on the Hotlist within the last {{ period }}"
                :value="uniquePrograms"
                :diff="uniqueProgramsDiff"
            />
            <Metric
                title="Votes Volyme"
                :value="votesVolume"
                :diff="votesVolumeDiff"
            />
            <Metric
                title="Forks Volume"
                :value="forksVolume"
                :diff="forksVolumeDiff"
            />
        </div>
    </div>
</template>

<script>
import Metric from '@/components/Metric.vue';

export default {
    name: 'Statistics',
    components: {
        Metric
    },
    data: () => ({
        uniquePrograms: null,
        uniqueProgramsDiff: null,
        votesVolume: null,
        votesVolumeDiff: null,
        forksVolume: null,
        forksVolumeDiff: null,
        period: 'hour'
    }),
    methods: {
        calculatePercentDiff(a, b) {
            console.log(Math.round(((a - b) / b) * 100));
            return Math.round(((a - b) / b) * 100);
        },
        prepareData() {
            const statisticsData = this.$parent.statisticsData;
            this.uniquePrograms = statisticsData[1].programs;
            this.votesVolume = statisticsData[1].votes;
            this.forksVolume = statisticsData[1].forks;
            this.uniqueProgramsDiff = this.calculatePercentDiff(
                statisticsData[1].programs,
                statisticsData[0].programs
            );
            this.votesVolumeDiff = this.calculatePercentDiff(
                statisticsData[1].votes,
                statisticsData[0].votes
            );
            this.forksVolumeDiff = this.calculatePercentDiff(
                statisticsData[1].forks,
                statisticsData[0].forks
            );
        }
    },
    mounted() {
        this.emitter.on('statistics-data', this.prepareData);
    }
};
</script>
