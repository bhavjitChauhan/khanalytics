<template>
    <div class="min-h-screen hero">
        <div class="w-full text-center hero-content">
            <div class="w-5/6 md:w-1/2">
                <router-link to="/search">
                    <h1 class="mb-8 -mt-32 text-5xl font-bold">
                        Search
                    </h1>
                </router-link>
                <div>
                    <form
                        id="search_form"
                        @submit.prevent="search"
                        class="form-control"
                    >
                        <div class="flex space-x-2">
                            <input
                                type="text"
                                :value="query"
                                name="query"
                                :placeholder="'Program ID' + (exampleID ? ` (e.g. ${exampleID})` : '')"
                                autofocus
                                class="w-full input input-primary input-bordered input-lg"
                                :class="{ 'input-warning': warning }"
                                @input="event => query = event.target.value"
                            >
                            <button
                                type="submit"
                                form="search_form"
                                name="submit"
                                class="btn btn-primary btn-lg"
                                :class="{ loading: searching, 'btn-square': searching }"
                            >
                                <font-awesome-icon
                                    v-if="!searching"
                                    icon="search"
                                />
                            </button>
                        </div>
                        <label class="h-0 mt-2 label">
                            <span
                                v-if="error"
                                class="label-text-alt text-error"
                            >{{ error }}</span>
                            <span
                                v-else-if="warning"
                                class="label-text-alt text-warning"
                            >{{ warning }}</span>
                        </label>

                    </form>
                </div>
                <div class="overflow-hidden whitespace-nowrap">
                    <marquee
                        scrollamount="5"
                        @mouseover="(event) => (event.target.stop ? event.target.stop() : event.target.parentElement.stop())"
                        @mouseout="(event) => (event.target.start ? event.target.start() : event.target.parentElement.start())"
                    >
                        <router-link
                            v-for="(program, id) in hotlistSnapshot"
                            :key="id"
                            :to="`/program/${id}`"
                            class="mx-1 btn btn-md btn-ghost"
                        >{{ program.title }}</router-link>
                    </marquee>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import extractProgramID from '@/util/programID';
import sampleSize from '@/util/sampleSize';

export default {
    name: 'Search',
    data: () => ({
        query: null,
        searching: false,
        warning: false,
        error: false,
        exampleID: null
    }),
    computed: {
        hotlistSnapshot() {
            return this.$store.state.hotlistSnapshot;
        },
        hotlistSnapshotKeys() {
            return Object.keys(this.$store.state.hotlistSnapshot);
        }
    },
    methods: {
        search() {
            this.warning = this.error = null;
            try {
                this.query = extractProgramID(this.query);
            } catch (err) {
                this.warning = 'Invalid program ID: ' + err.message;
                return;
            }
            this.searching = true;

            try {
                this.$router.push({
                    name: 'program',
                    params: { id: this.query }
                });
            } catch (err) {
                this.searching = false;
                this.error = 'Invalid program ID: ' + err.message;
            }
        },
        updateExampleID() {
            const isURL = Math.random() < 0.5;
            this.exampleID =
                (isURL ? 'khanacademy.org/cs/-/' : '') +
                sampleSize(this.hotlistSnapshotKeys);
        }
    },
    watch: {
        hotlistSnapshotKeys: {
            handler() {
                this.updateExampleID();
            }
        }
    },
    created() {
        const query = this.$route.params.query;
        if (query) {
            this.query = this.$route.params.query;
            this.search();
        }
        this.$watch(
            () => this.$route.params,
            (params) => {
                this.query = params.query;
                this.search();
            }
        );
        setInterval(() => {
            const hotlistSnapshotKeys = this.hotlistSnapshotKeys;
            if (!hotlistSnapshotKeys) return null;

            this.updateExampleID();
        }, 5000);
    }
};
</script>
