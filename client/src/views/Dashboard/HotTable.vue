<template>
    <div
        id="hotlist-table-container"
        class="flex flex-col h-full p-5 space-y-4 rounded ring-1 ring-base-300"
    >
        <div class="overflow-x-hidden">
            <table
                class="table w-full table-fixed table-compact"
                id="hotlist-table"
            >
                <thead class="sticky top-0">
                    <tr>
                        <th class="w-1/12"></th>
                        <th class="w-1/2">Program</th>
                        <th class="w-1/6">Votes</th>
                        <th class="w-1/6">Forks</th>
                    </tr>
                </thead>
                <tbody v-if="Object.keys(programs).length != 0">
                    <tr
                        v-for="(program, index) in programs"
                        :key="index"
                        class="hover"
                    >
                        <th class="text-right">{{ program.rank }}</th>
                        <td
                            class="truncate"
                            :title="program.title"
                        >
                            <router-link
                                v-if="program.title"
                                :to="`/program/${program.program_id}`"
                            >
                                {{ program.title }}
                            </router-link>
                            <span v-else>...</span>
                        </td>
                        <td> {{ program.votes }} </td>
                        <td> {{ program.forks }} </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Container from '@/components/Container.vue';

export default {
    name: 'HotTable',
    components: {
        Container
    },
    computed: {
        programs() {
            const hotlistSnapshot = this.$store.state.hotlistSnapshot;
            if (!hotlistSnapshot) return null;

            return Object.entries(hotlistSnapshot).map((entry) => {
                const [id, program] = entry;
                return {
                    program_id: id,
                    title: program.title,
                    rank: program.rank,
                    votes: program.votes,
                    forks: program.forks
                };
            });
        }
    },
    methods: {
        updateHeight() {
            const element = document.getElementById('hotlist-table');
            if (!element) return;

            element.parentElement.parentElement.style.height =
                document.getElementById('main-chart').clientHeight + 'px';
        }
    }
};
</script>

<style scoped>
.table th:first-child {
    position: static;
}

#hotlist-table-container {
    height: 645px;
}
</style>
