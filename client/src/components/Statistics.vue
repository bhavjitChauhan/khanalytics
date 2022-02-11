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
    computed: {
        statisticsData() {
            const data = this.$store.state.statisticsData;
            if (this.isEmpty(data)) return null;

            return this.$store.state.statisticsData;
        },
        uniquePrograms() {
            const statisticsData = this.statisticsData;
            if (this.isEmpty(statisticsData)) return null;

            return statisticsData.map((statistic) => statistic.programs);
        },
        votesVolume() {
            const statisticsData = this.statisticsData;
            if (this.isEmpty(statisticsData)) return null;

            return statisticsData.map((statistic) => statistic.votes);
        },
        forksVolume() {
            const statisticsData = this.statisticsData;
            if (this.isEmpty(statisticsData)) return null;

            return statisticsData.map((statistic) => statistic.forks);
        },
        comments() {
            const statisticsData = this.statisticsData;
            if (this.isEmpty(statisticsData)) return null;
            
            return statisticsData.map((statistic) => statistic.comments);
        },
        commentVotes() {
            const statisticsData = this.statisticsData;
            if (this.isEmpty(statisticsData)) return null;

            return statisticsData.map((statistic) => statistic.commentVotes);
        },
        replies() {
            const statisticsData = this.statisticsData;
            if (this.isEmpty(statisticsData)) return null;
            
            return statisticsData.map((statistic) => statistic.replies);
        }
    },
    methods: {
        isEmpty(obj) {
            return !obj || Object.keys(obj).length == 0;
        }
    }
};
</script>
