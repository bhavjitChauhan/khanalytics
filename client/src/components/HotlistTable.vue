<template>
    <div class="flex flex-col p-5 space-y-4 rounded shadow-lg h-full">
        <div class="overflow-x-auto">
            <table class="table w-full table-compact">
                <thead>
                    <tr>
                        <th></th>
                        <th>Program</th>
                        <th>Votes</th>
                        <th>Forks</th>
                    </tr>
                </thead>
                <tbody v-if="Object.keys(programs).length != 0">
                    <tr
                        v-for="(program, index) in programs"
                        :key="index"
                    >
                        <th>{{ program.rank }}</th>
                        <td>
                            <a
                                v-if="program.title"
                                :href="`https://khanacademy.org/cs/-/${program.program_id}`"
                                target="_blank"
                            >
                                {{ program.title}}
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
import api from '@/services/api';

export default {
    name: 'HotlistTable',
    data: () => ({
        programs: {}
    }),
    methods: {
        prepareData() {
            const hotlistSnapshot = this.$parent.hotlistSnapshot;
            this.programs = hotlistSnapshot.filter(
                (program) => program.rank <= 10
            );
            this.fetchProgramsData();
        },
        async fetchProgramsData() {
            const MAX_TITLE_LENGTH = 24;

            const ids = this.programs.map((program) => program.program_id);
            const titles = [];

            for (const id of ids) {
                await api
                    .fetchProgramData(
                        `scratchpads/${id}?projection={"title":1}`
                    )
                    .then((program) => {
                        let title = program.title;
                        if (title.length > MAX_TITLE_LENGTH) {
                            title =
                                title.substring(0, MAX_TITLE_LENGTH - 3) +
                                '...';
                        }
                        titles.push(title);
                    });
            }

            const programs = this.programs;
            programs.map((program, i) => {
                program.title = titles[i];
                return program;
            });
            this.programs = programs;
        }
    },
    mounted() {
        this.emitter.on('hotlist-snapshot', this.prepareData);
    }
};
</script>
