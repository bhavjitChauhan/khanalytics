<template>
    <div class="p-5">
        <div class="w-full shadow stats">
            <div
                class="stat"
                id="votes-stat"
            >
                <div class="stat-title">Votes Volume</div>
                <div class="stat-value">
                    <div
                        v-if="!votesVolume"
                        class="flex space-x-4 animate-pulse"
                    >
                        <div class="w-1/6 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <span v-if="votesVolume">{{ votesVolume }}</span>
                </div>
                <div class="stat-value">
                    <progress
                        class="progress progress-primary"
                        value="0"
                        max="100"
                    ></progress>
                </div>
                <div class="stat-desc">
                    <div
                        v-if="!period"
                        class="flex space-x-4 animate-pulse"
                    >
                        <div class="w-1/3 h-4 bg-gray-300 rounded"></div>
                        <span v-if="period">{{ period }}</span>
                    </div>
                </div>
            </div>
            <div
                class="stat"
                id="forks-stat"
            >
                <div class="stat-title">Forks Volume</div>
                <div class="stat-value">
                    <div
                        v-if="!forksVolume"
                        class="flex space-x-4 animate-pulse"
                    >
                        <div class="w-1/6 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <span v-if="forksVolume">{{ forksVolume }}</span>
                </div>
                <div class="stat-value">
                    <progress
                        class="progress progress-primary"
                        value="0"
                        max="100"
                    ></progress>
                </div>
                <div class="stat-desc">
                    <div
                        v-if="!period"
                        class="flex space-x-4 animate-pulse"
                    >
                        <div class="w-1/3 h-4 bg-gray-300 rounded"></div>
                        <span v-if="period">{{ period }}</span>
                    </div>
                </div>
            </div>
            <div
                class="stat"
                id="programs-stat"
            >
                <div class="stat-title">Unique Programs</div>
                <div class="stat-value">
                    <div
                        v-if="!uniquePrograms"
                        class="flex space-x-4 animate-pulse"
                    >
                        <div class="w-1/3 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <span v-if="uniquePrograms">{{ uniquePrograms }}</span>
                </div>
                <div class="stat-desc">
                    <div
                        v-if="!period"
                        class="flex space-x-4 animate-pulse"
                    >
                        <div class="w-1/3 h-4 bg-gray-300 rounded"></div>
                        <span v-if="period">{{ period }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InlineWorker from '../lib/InlineWorker.js';

export default {
    name: 'Statistics',
    data: () => ({
        votesVolume: null,
        forksVolume: null,
        uniquePrograms: null,
        period: null
    }),
    methods: {
        prepareData() {
            const data = this.$parent.hotlistData;

            this.calculateVotesVolume(data);
            this.calculateForksVolume(data);
            this.calculateUniquePrograms(data);
            this.calculatePeriod();
        },
        calculateVotesVolume(data) {
            const votesVolumeWorker = new InlineWorker((event) => {
                const data = event.data;
                let totalVotes = 0;
                const programIDs = [
                    ...new Set(data.map((program) => program.program_id))
                ];
                for (let i = 0; i < programIDs.length; i++) {
                    const entries = data.filter(
                        (program) => program.program_id == programIDs[i]
                    );
                    const earliestVoteCount = Math.min(
                        ...entries.map((program) => program.votes)
                    );
                    const latestVoteCount = Math.max(
                        ...entries.map((program) => program.votes)
                    );
                    totalVotes += latestVoteCount - earliestVoteCount;
                    postMessage({
                        totalVotes,
                        progress: (i / programIDs.length) * 100
                    });
                }
                postMessage('Complete');
            });
            votesVolumeWorker.postMessage(JSON.parse(JSON.stringify(data)));
            const progressBar = document.querySelector('#votes-stat progress');
            votesVolumeWorker.onmessage = (event) => {
                const data = event.data;
                if (data == 'Complete') {
                    votesVolumeWorker.terminate();
                } else {
                    this.votesVolume = data.totalVotes;
                    progressBar.value = data.progress;
                }
            };
        },
        calculateForksVolume(data) {
            const forksVolumeWorker = new InlineWorker((event) => {
                const data = event.data;
                let totalForks = 0;
                const programIDs = [
                    ...new Set(data.map((program) => program.program_id))
                ];
                for (let i = 0; i < programIDs.length; i++) {
                    const entries = data.filter(
                        (program) => program.program_id == programIDs[i]
                    );
                    const earliestForkCount = Math.min(
                        ...entries.map((program) => program.forks)
                    );
                    const latestForkCount = Math.max(
                        ...entries.map((program) => program.forks)
                    );
                    totalForks += latestForkCount - earliestForkCount;
                    postMessage({
                        totalForks,
                        progress: (i / programIDs.length) * 100
                    });
                }
                postMessage('Complete');
            });
            forksVolumeWorker.postMessage(JSON.parse(JSON.stringify(data)));
            const progressBar = document.querySelector('#forks-stat progress');
            forksVolumeWorker.onmessage = (event) => {
                const data = event.data;
                if (data == 'Complete') {
                    forksVolumeWorker.terminate();
                } else {
                    this.forksVolume = data.totalForks;
                    progressBar.value = data.progress;
                }
            };
        },
        calculateUniquePrograms(data) {
            const uniqueProgramsWorker = new InlineWorker((event) => {
                const data = event.data;
                const programIDs = new Set(
                    data.map((program) => program.program_id)
                );
                postMessage(programIDs.size);
            });
            uniqueProgramsWorker.postMessage(JSON.parse(JSON.stringify(data)));
            uniqueProgramsWorker.onmessage = (event) => {
                const data = event.data;
                this.uniquePrograms = data;
                uniqueProgramsWorker.terminate();
            };
        },
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
        this.emitter.on('hotlist-data', () => {
            this.prepareData();
        });
    }
};
</script>
