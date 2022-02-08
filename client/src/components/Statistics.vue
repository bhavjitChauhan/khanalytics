<template>
    <div class="p-5">
        <div class="w-full shadow-lg stats">
            <Metric
                title="Unique Programs"
                tooltip="Number of programs that were on the Hotlist"
                :data="uniquePrograms"
                chartColor="#570DF8"
            />
            <Metric
                title="Votes Volume"
                tooltip="Number of votes that were cast"
                :data="votesVolume"
                chartColor="#008FFB"
            />
            <Metric
                title="Forks Volume"
                tooltip="Number of forks that were created"
                :data="forksVolume"
                chartColor="#14BF95"
            />
            <!-- <Metric
                title="Comments Volume"
                tooltip="Number of comments that were posted"
                :data="comments"
                chartColor="#FEB019"
            />
            <Metric
                title="Comments Votes Volume"
                tooltip="Number of comment votes that were cast"
                :data="commentVotes"
                chartColor="#FEB019"
            />
            <Metric
                title="Replies Volume"
                tooltip="Number of replies that were posted"
                :data="replies"
                chartColor="#FEB019"
            /> -->
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
        votesVolume: null,
        forksVolume: null,
        comments: null,
        commentVotes: null,
        replies: null
    }),
    methods: {
        calculatePercentDiff(a, b) {
            return Math.round(((a - b) / b) * 100);
        },
        prepareData() {
            const statisticsData = this.$parent.statisticsData;
            this.uniquePrograms = statisticsData.map(
                (statistic) => statistic.programs
            );
            this.votesVolume = statisticsData.map(
                (statistic) => statistic.votes
            );
            this.forksVolume = statisticsData.map(
                (statistic) => statistic.forks
            );
            this.comments = statisticsData.map((statistic) => statistic.comments);
            this.commentVotes = statisticsData.map(
                (statistic) => statistic.commentVotes
            );
            this.replies = statisticsData.map((statistic) => statistic.replies);
        }
    },
    mounted() {
        this.emitter.on('statistics-data', this.prepareData);
    }
};
</script>
