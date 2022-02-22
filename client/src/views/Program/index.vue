<template>
    <div class="mb-4">
        <div
            v-if="isPredatingProgram"
            class="alert alert-error"
        >
            <div class="flex-1">
                <label>
                    <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon> &nbsp; The current program was created before Khanalytics started recording the Hotlist. Data may be partially or completely missing.
                </label>
            </div>
        </div>
        <div
            v-else-if="isLegacyProgram"
            class="alert alert-warning"
        >
            <div class="flex-1">
                <label>
                    <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon> &nbsp; The current program was created before Khanalytics started recording discussions. Discussions data may be partially or completely missing.
                </label>
            </div>
        </div>
    </div>

    <div class="mb-8">
        <h1 class="mb-2 text-4xl">
            <span class="font-bold">Program:</span> {{ title ? title : id }} <div
                class="badge badge-lg tooltip tooltip-bottom"
                data-tip="Color Hash"
                :style="{ 'background-color': color }"
            ></div>
        </h1>
        <span class="text-lg">This is an overview of <a
                :href="`https://khanacademy.org/cs/-/${id}`"
                target="_blank"
                class="link"
            >{{ title ? title : id }}</a> {{ userData && 'by' }} <a
                v-if="userData"
                :href="`https://khanacademy.org/profile/${userData.username}/projects`"
                class="link"
            >{{ userData.nickname }}</a>. Use the
            <InfoButton
                id=""
                :demo="true"
            /> buttons to see what information is displayed.
        </span>
    </div>

    <div class="grid grid-cols-4 grid-rows-1 gap-4">
        <div class="col-span-4 row-span-1 lg:col-span-3">
            <MainChart
                :id="id"
                height="550px"
            />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-1">
            <InfoTable
                :id="id"
                height="550px"
            />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-3">
            <RankChart
                :id="id"
                height="350px"
            />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-1">
            <RadarChart height="350px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-1">
            <HeatMapTable height="350px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-3">
            <HeatMapChart
                :id="id"
                height="350px"
            />
        </div>
    </div>
</template>

<script>
import api from '@/services/api';
import colorHash from '@/util/colorHash';
import {
    beforeRecording,
    beforeDiscussionRecording
} from '@/util/programCreation';

import InfoButton from '@/components/InfoButton.vue';
import MainChart from '@/views/Program/MainChart.vue';
import InfoTable from '@/views/Program/InfoTable.vue';
import RankChart from '@/views/Program/RankChart.vue';
import RadarChart from '@/views/Program/RadarChart.vue';
import HeatMapTable from '@/views/Program/HeatMapTable.vue';
import HeatMapChart from '@/views/Program/HeatMapChart.vue';

export default {
    name: 'Program',
    components: {
        InfoButton,
        MainChart,
        InfoTable,
        RankChart,
        RadarChart,
        HeatMapTable,
        HeatMapChart
    },
    data: () => ({
        id: null,
        programData: null,
        performance: null,
        userData: null,
        userTopProgramsData: null,
        userTopProgramsDiscussions: null
    }),
    computed: {
        isPredatingProgram() {
            const programData = this.programData;
            if (!programData) return null;

            return beforeRecording(programData.created);
        },
        isLegacyProgram() {
            const programData = this.programData;
            if (!programData) return null;

            return beforeDiscussionRecording(programData.created);
        },
        title() {
            return this.programData && this.programData.title;
        },
        color() {
            const id = this.id;
            if (!id) return null;

            return colorHash.hex(this.id);
        }
    },
    methods: {
        async fetchData() {
            this.id = this.$route.params.id;
            if (!this.id) return;

            const performance = await api.fetchPerformanceData(`${this.id}`);
            this.performance = Object.keys(performance).length
                ? performance
                : null;

            const { scratchpad: programData, creatorProfile: userData } =
                await api.fetchKhanInternal(
                    `show_scratchpad?scratchpad_id=${this.id}&projection={"scratchpad":1,"creatorProfile":1}`
                );
            this.programData = programData;
            this.userData = userData;

            if (this.isPredatingProgram) return;

            this.userTopProgramsData = (
                await api.fetchKhanLabs(
                    `user/scratchpads?kaid=${userData.kaid}&limit=10&projection={%22scratchpads%22:1}`
                )
            ).scratchpads.map(({ url, sumVotesIncremented, spinoffCount }) => ({
                id: url.split('/')[5],
                votes: sumVotesIncremented,
                forks: spinoffCount
            }));

            const userTopProgramsDiscussions = [];
            for (const program of this.userTopProgramsData) {
                const data = (
                    await api.fetchKhanInternal(
                        `discussions/scratchpad/${program.id}/comments?limit=1000&projection={"feedback":1,"isComplete":1}`
                    )
                ).feedback;
                userTopProgramsDiscussions.push({
                    comments: data.length,
                    commentVotes: data.reduce(
                        (acc, cur) => acc + cur.sumVotesIncremented,
                        0
                    ),
                    replies: data.reduce((acc, cur) => acc + cur.replyCount, 0)
                });
            }
            this.userTopProgramsDiscussions = userTopProgramsDiscussions;

            this.emitter.emit(`program-data-${this.id}`);
        }
    },
    async mounted() {
        this.id = this.$route.params.id;
        if (this.id) this.fetchData();
        this.$watch(() => this.$route.params, this.fetchData);
    }
};
</script>
