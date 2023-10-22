<template>
    <div class="mb-4">
        <div v-if="isPredatingProgram" class="alert alert-error">
            <div class="flex-1">
                <label>
                    <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon> &nbsp; The current program was
                    created before Khanalytics started recording the Hotlist. Data may be partially or completely
                    missing.
                </label>
            </div>
        </div>
        <div v-else-if="isLegacyProgram" class="alert alert-warning">
            <div class="flex-1">
                <label>
                    <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon> &nbsp; The current program was
                    created before Khanalytics started recording discussions. Discussions data may be partially or
                    completely missing.
                </label>
            </div>
        </div>
    </div>

    <div class="mb-8">
        <h1 class="mb-2 text-4xl">
            <span class="font-bold">Program:</span> {{ title ? title : id }}
            <!-- <div
                class="badge badge-lg tooltip tooltip-bottom"
                data-tip="Color Hash"
                :style="{ 'background-color': color }"
            ></div> -->
            <div v-if="programQueryData" class="ml-2"
                :style="{ display: (programQueryData.originScratchpad || programQueryData.byChild || programQueryData.hideFromHotlist) ? 'inline' : 'none' }">
                <div v-if="programQueryData.originScratchpad != null"
                    class="mb-2 font-semibold uppercase align-middle badge badge-lg badge-info"><a
                        :href="`https://khanacademy.org/cs/-/${programQueryData.originScratchpad}`"
                        target="_blank">Spin-Off</a></div>
                <div v-if="programQueryData.byChild"
                    class="mb-2 font-semibold uppercase align-middle badge badge-lg badge-warning">Child Account</div>
                <div v-if="programQueryData.hideFromHotlist"
                    class="mb-2 font-semibold uppercase align-middle badge badge-lg badge-error">Hidden</div>
            </div>
        </h1>
        <span class="text-lg">This is an overview of <a :href="`https://khanacademy.org/cs/-/${id}`" target="_blank"
                class="link">{{ title ? title : id }}</a> {{ programQueryData && programQueryData.creatorProfile && 'by'
                }} <a v-if="programQueryData && programQueryData.creatorProfile"
                :href="`https://khanacademy.org${programQueryData.creatorProfile.profileRoot}projects`" target="_blank"
                class="link">{{
                        programQueryData.creatorProfile.nickname
                }}</a>. Use the
            <InfoButton id="" :demo="true" /> buttons to see what information is displayed.
        </span>
    </div>

    <div class="grid grid-cols-4 grid-rows-1 gap-4">
        <div class="col-span-4 row-span-1 lg:col-span-3">
            <MainChart :id="id" height="550px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-1">
            <InfoTable :id="id" height="550px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-3">
            <RankChart :id="id" height="350px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-1">
            <RadarChart height="350px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-1">
            <HeatMapTable height="350px" />
        </div>
        <div class="col-span-4 row-span-1 lg:col-span-3">
            <HeatMapChart :id="id" height="350px" />
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
import {
    projectsAuthoredByUserBody,
    feedbackQueryBody,
    programQueryBody,
    avatarDataForProfileBody
} from '@/util/graphql';

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
        programQueryData: null,
        avatarDataForProfileData: null,
        performance: null,
        userTopProgramsData: null,
        userTopProgramsDiscussions: null
    }),
    computed: {
        isPredatingProgram() {
            const programQueryData = this.programQueryData;
            if (!programQueryData) return null;

            return beforeRecording(programQueryData.created);
        },
        isLegacyProgram() {
            const programQueryData = this.programQueryData;
            if (!programQueryData) return null;

            return beforeDiscussionRecording(programQueryData.created);
        },
        title() {
            return this.programQueryData && this.programQueryData.title;
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
            this.emitter.emit(`performance-program-data-${this.id}`);

            this.programQueryData = (await api.postKhanGraphQL('programQuery', programQueryBody({ programId: this.id }))).data.programById;
            this.avatarDataForProfileData = (await api.postKhanGraphQL('avatarDataForProfile', avatarDataForProfileBody({ kaid: this.programQueryData.creatorProfile.kaid }))).data.user;

            if (this.isPredatingProgram) return;

            const projectsAuthoredByUserData = await api.postKhanGraphQL('projectsAuthoredByUser', projectsAuthoredByUserBody({ kaid: this.programQueryData.creatorProfile.kaid }));

            this.userTopProgramsData = projectsAuthoredByUserData.data.user.programs.programs.map(({ id, sumVotesIncremented, displayableSpinoffCount }) => ({
                id,
                votes: sumVotesIncremented,
                forks: displayableSpinoffCount
            }));

            const userTopProgramsDiscussions = [];
            for (const program of this.userTopProgramsData) {
                const feedbackQueryData = await api.postKhanGraphQL('feedbackQuery', feedbackQueryBody({ topicId: program.id }));
                if (feedbackQueryData.data.feedback.feedback === null) continue;
                userTopProgramsDiscussions.push({
                    comments: feedbackQueryData.data.feedback.feedback.length,
                    commentVotes: feedbackQueryData.data.feedback.feedback.reduce(
                        (acc, cur) => {
                            if (!cur) return acc;
                            return acc + cur.sumVotesIncremented
                        }, 0
                    ),
                    replies: feedbackQueryData.data.feedback.feedback.reduce((acc, cur) => {
                        if (!cur) return acc;
                        return acc + cur.replyCount
                    }, 0)
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
