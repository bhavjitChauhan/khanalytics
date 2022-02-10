<template>
    <div class="flex flex-col h-full p-2 py-5 space-y-4 rounded shadow-lg">
        <div class="overflow-x-auto">
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
                            <a
                                v-if="program.title"
                                :href="`https://khanacademy.org/cs/-/${program.program_id}`"
                                target="_blank"
                            >
                                {{ program.title }}
                            </a>
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
export default {
    name: 'HotTable',
    data: () => ({
        programs: {}
    }),
    methods: {
        prepareData() {
            const hotlistSnapshot = this.$parent.hotlistSnapshot;
            this.programs = Object.entries(hotlistSnapshot).map((entry) => {
                const [id, program] = entry;
                return {
                    program_id: id,
                    title: program.title,
                    rank: program.rank,
                    votes: program.votes,
                    forks: program.forks
                };
            });
            const element = document.getElementById('hotlist-table');
            element.parentElement.parentElement.style.height =
                document.getElementById('main-chart').clientHeight + 'px';
        }
    },
    mounted() {
        this.emitter.on('hotlist-snapshot', this.prepareData);
    }
};
</script>

<style scoped>
.table th:first-child {
    position: static;
}
</style>
