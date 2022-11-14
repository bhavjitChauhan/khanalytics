<template>
    <Container
        :height="height"
        class="relative overflow-auto"
    >
        <div
            v-if="programData || userData"
            class="grid h-full grid-cols-2 grid-rows-auto"
        >
            <div
                v-if="programData"
                class="col-span-1 row-span-1"
            >
                <Container
                    width="fit-content"
                    height="fit-content"
                    class="p-2 mb-4 transition-all shadow-xl bg-base-100 hover:scale-105 hover:shadow-2xl"
                >
                    <a
                        v-if="programData"
                        :href="`https://khanacademy.org/cs/-/${id}`"
                        target="_blank"
                    ><img :src="programData.imageUrl"></a>
                </Container>
            </div>
            <div
                v-if="userData"
                class="w-full col-span-1 row-span-1 px-1 text-center place-self-center"
            >
                <div class="dropdown dropdown-end">
                    <label
                        tabindex="0"
                        class="cursor-pointer text-info-content"
                    >
                        <img
                            :src="userData.avatarSrc"
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
                                :href="`https://www.khanacademy.org/profile/${userData.username}/projects`"
                                target="_blank"
                                class="card-title"
                            >{{ userData.nickname }}&nbsp;<font-awesome-icon icon="external-link-alt"></font-awesome-icon></a>
                            <p>{{ userData.bio }}</p>
                        </div>
                    </div>
                </div>
                <span
                    class="block font-bold truncate"
                    :title="userData.nickname"
                >{{ userData.nickname }}</span>
                <span
                    class="block text-xs text-gray-500 truncate"
                    :title="'@' + userData.username"
                >@{{ userData.username }}</span>
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
            v-if="userData"
            class="sticky bottom-0 z-10 w-full col-span-2 row-span-1 gap-1 pt-4 mt-2 overflow-y-auto border-t-2 lg:btn-group place-content-center bg-base-200"
        >
            <a
                :href="`https://khanacademy.org/cs/-/${id}`"
                target="_blank"
                class="btn btn-sm btn-outline"
            >Project</a>
            <a
                :href="`https://www.khanacademy.org/profile/${userData.username}/projects`"
                target="_blank"
                class="btn btn-sm btn-outline"
            >Profile</a>
            <a
                :href="`https://khanacademy.org/api/internal/show_scratchpad?scratchpad_id=${id}&format=pretty`"
                target="_blank"
                class="btn btn-sm btn-outline"
            >Endpoint</a>
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
        programData() {
            return this.$parent.programData;
        },
        userData() {
            return this.$parent.userData;
        },
        userTopPrograms() {
            return this.$parent.userTopPrograms;
        },
        formattedData() {
            const hotlistSnapshot = this.hotlistSnapshot;
            const performance = this.performance;
            const programData = this.programData;
            if (!hotlistSnapshot || !programData) return null;

            let data = {
                Rank:
                    (hotlistSnapshot[this.id] &&
                        hotlistSnapshot[this.id].rank) ||
                    '-',
                Votes: programData.sumVotesIncremented,
                Forks: programData.spinoffCount,
                Flags: programData.flags.length,
                Type:
                    programData.userAuthoredContentType == 'pjs'
                        ? 'Processing'
                        : programData.userAuthoredContentType == 'webpage'
                        ? 'HTML'
                        : programData.userAuthoredContentType == 'sql'
                        ? 'SQL'
                        : 'Other',
                Created: formatDate(programData.created, true),
                Updated:
                    programData.date != programData.created
                        ? formatDate(programData.date, true)
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
                Lines: programData.revision.code
                    .split('\n')
                    .length.toLocaleString()
            };

            return data;
        }
    }
};
</script>