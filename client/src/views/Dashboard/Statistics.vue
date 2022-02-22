<template>
    <Container class="relative w-full p-0 stats">
        <Metric
            title="
                Unique
                Programs"
            :data="uniquePrograms"
            chartColor="#570DF8"
        />
        <Metric
            title="Votes Volume"
            :data="votesVolume"
            chartColor="#00E396"
        />
        <Metric
            title="Forks Volume"
            :data="forksVolume"
            chartColor="#FEB019"
        />
        <Metric
            title="Comments Volume"
            :data="comments"
            chartColor="#FF4560"
        />
        <Metric
            title="Upvotes Volume"
            :data="commentVotes"
            chartColor="#775DD0"
        />
        <Metric
            title="Replies Volume"
            :data="replies"
            chartColor="#008FFB"
        />
        <!-- <InfoButton :corner="false" :hovering="true" id="statistics-modal">
        </InfoButton> -->
    </Container>
    <div class="mb-4"></div>
</template>

<script>
import Container from '@/components/Container.vue';
import InfoButton from '@/components/InfoButton.vue';
import Metric from '@/views/Dashboard/Metric.vue';

export default {
    name: 'Statistics',
    components: {
        Container,
        InfoButton,
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
