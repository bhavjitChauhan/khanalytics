<template>
    <div class="p-5">
        <div class="w-full shadow stats">
            <Metric
                title="Unique Programs"
                :value="uniquePrograms"
            />
            <Metric
                title="Votes Volyme"
                :value="votesVolume"
            />
            <Metric
                title="Forks Volume"
                :value="forksVolume"
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
        votesVolume: null,
        forksVolume: null,
        period: null
    }),
    methods: {
        calculatePeriod() {
            const options = { month: 'short' };
            const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
            const endDate = new Date();
            this.period = `${new Intl.DateTimeFormat('en-US', options).format(
                startDate
            )} ${startDate.getDate()} - ${new Intl.DateTimeFormat(
                'en-US',
                options
            ).format(endDate)} ${endDate.getDate()}`;
        }
    },
    mounted() {
        this.emitter.on('unique-programs', () => {
            this.uniquePrograms = this.$parent.uniquePrograms;
        });
        this.emitter.on('votes-volume', () => {
            this.votesVolume = this.$parent.votesVolume;
        });
        this.emitter.on('forks-volume', () => {
            this.forksVolume = this.$parent.forksVolume;
        });
    }
};
</script>
