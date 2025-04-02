<template>
    <Container
        :height="height"
        class="relative overflow-auto"
    >
        <div
            v-if="programQueryData"
            class="grid h-full grid-cols-2 grid-rows-auto"
        >
            <div
                v-if="programQueryData"
                class="col-span-1 row-span-1"
            >
                <Container
                    width="fit-content"
                    height="fit-content"
                    class="p-2 mb-4 transition-all shadow-xl bg-base-100 hover:scale-105 hover:shadow-2xl"
                >
                    <a
                        v-if="programQueryData"
                        :href="`https://khanacademy.org/cs/-/${id}`"
                        target="_blank"
                    ><img :src="'https://www.khanacademy.org' + programQueryData.imagePath"></a>
                </Container>
            </div>
            <div
                v-if="(programQueryData && programQueryData.creatorProfile && avatarDataForProfileData)"
                class="w-full col-span-1 row-span-1 px-1 text-center place-self-center"
            >
                <div class="dropdown dropdown-end">
                    <label
                        tabindex="0"
                        class="cursor-pointer text-info-content"
                    >
                        <img
                            :src="'https://khanacademy.org' + avatarDataForProfileData.avatar.imageSrc"
                            :width="100"
                            :height="100"
                            class="inline-block transition-all rounded-full shadow-xl bg-primary hover:shadow-2xl hover:scale-105"
                        >
                    </label>
                    <div
                        tabindex="0"
                        class="w-64 shadow card compact dropdown-content bg-base-100 rounded-box"
                    >
                        <div class="card-body">
                            <a
                                :href="`https://www.khanacademy.org${programQueryData.creatorProfile.profileRoot}projects`"
                                target="_blank"
                                class="card-title"
                            >{{ programQueryData.creatorProfile.nickname }}&nbsp;<font-awesome-icon icon="external-link-alt"></font-awesome-icon></a>
                            <!-- <p>{{ userData.bio }}</p> -->
                        </div>
                    </div>
                </div>
                <span
                    class="block font-bold truncate"
                    :title="programQueryData.creatorProfile.nickname"
                >{{ programQueryData.creatorProfile.nickname }}</span>
                <span
                    class="block text-xs text-gray-500 truncate"
                    :title="('@' + programQueryData.creatorProfile.profileRoot.slice(9, -1))"
                >@{{ programQueryData.creatorProfile.profileRoot.slice(9, -1) }}</span>
            </div>
            <div
                v-if="formattedData"
                class="col-span-2 row-span-1"
            >
                <table class="table w-full mx-auto table-compact">
                    <tbody>
                        <tr
                            v-for="(data, key) in formattedData"
                            :key="key"
                        >
                            <td class="p-1 font-bold text-right capitalize bg-transparent">{{ key }}</td>
                            <td class="p-1 text-left bg-transparent">{{ data || '-' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div
            v-if="programQueryData && programQueryData.creatorProfile"
            class="sticky bottom-0 z-10 w-full col-span-2 row-span-1 gap-1 pt-4 mt-2 overflow-y-auto border-t-2 lg:btn-group place-content-center bg-base-200"
        >
            <a
                :href="`https://khanacademy.org/cs/-/${id}`"
                target="_blank"
                class="btn btn-sm btn-outline"
            >Project</a>
            <a
                :href="`https://www.khanacademy.org${programQueryData.creatorProfile.profileRoot}projects`"
                target="_blank"
                class="btn btn-sm btn-outline"
            >Profile</a>
            <!-- <a
                :href="`https://khanacademy.org/api/internal/show_scratchpad?scratchpad_id=${id}&format=pretty`"
                target="_blank"
                class="btn btn-sm btn-outline"
            >Endpoint</a> -->
        </div>
    </Container>
</template>

<script>
import formatDate from '@/util/formatDate';

import Container from '@/components/Container.vue';

export default {
    name: 'InfoTable',
    components: {
        Container
    },
    props: {
        height: String,
        id: String
    },
    computed: {
        hotlistSnapshot: function () {
            return this.$store.state.hotlistSnapshot;
        },
        performance: function () {
            return this.$parent.performance;
        },
        programQueryData() {
            return this.$parent.programQueryData;
        },
        avatarDataForProfileData() {
            return this.$parent.avatarDataForProfileData;
        },
        userTopPrograms() {
            return this.$parent.userTopPrograms;
        },
        formattedData() {
            const hotlistSnapshot = this.hotlistSnapshot;
            const performance = this.performance;
            const programQueryData = this.programQueryData;
            if (!hotlistSnapshot || !programQueryData) return null;

            let data = {
                Rank:
                    (hotlistSnapshot[this.id] &&
                        hotlistSnapshot[this.id].rank) ||
                    '-',
                Votes: programQueryData.sumVotesIncremented,
                Forks: programQueryData.spinoffCount,
                Flags: 0,
                Type:
                    programQueryData.userAuthoredContentType == 'PJS'
                        ? 'Processing'
                        : programQueryData.userAuthoredContentType == 'WEBPAGE'
                        ? 'HTML'
                        : programQueryData.userAuthoredContentType == 'SQL'
                        ? 'SQL'
                        : programQueryData.userAuthoredContentType,
                Created: formatDate(programQueryData.created, true),
                Updated:
                programQueryData.revision.created != programQueryData.created
                        ? formatDate(programQueryData.revision.created, true)
                        : '-'
            };
            if (performance) {
                data = {
                    ...data,
                    Comments: performance[performance.length - 1].comments,
                    Upvotes: performance[performance.length - 1].commentVotes,
                    Replies: performance[performance.length - 1].replies
                };
            }
            data = {
                ...data,
                Lines: programQueryData.revision.code
                    .split('\n')
                    .length.toLocaleString()
            };

            return data;
        }
    }
};
</script>
