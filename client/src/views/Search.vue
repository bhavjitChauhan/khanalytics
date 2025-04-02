<template>
    <div class="w-full min-h-screen pt-64 place-items-center">
        <div class="w-full">
            <div class="flex items-center justify-center w-full text-center">
                <div class="w-5/6 lg:w-1/2">
                    <router-link to="/search">
                        <h1 class="mb-8 -mt-32 text-5xl font-bold">
                            Search
                        </h1>
                    </router-link>
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
                                class="transition-all btn btn-primary btn-lg btn-circle hover:scale-110"
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
            </div>
            <MarqueeText :duration="120" class="hidden md:block">
                <div class="grid grid-flow-col grid-rows-1 py-8 space-x-4">
                    <router-link
                        v-for="program in hotlistArray"
                        :key="program.id"
                        :to="`/program/${program.id}`"
                    >
                        <div class="w-32 transition-all shadow-xl md:w-64 card bg-base-100 hover:scale-105">
                            <figure>
                                <img
                                    :src="`https://www.khanacademy.org/computer-programming/-/${program.id}/latest.png`"
                                    :alt="program.title"
                                >
                            </figure>
                            <div class="p-4 card-body">
                                <h2
                                    class="truncate card-title"
                                    :title="program.title"
                                >{{ program.title }}</h2>
                                <p
                                    class="truncate card-text"
                                    :title="program.author"
                                >{{ program.author }}</p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </MarqueeText>
        </div>
    </div>
</template>

<script>
import extractProgramID from '@/util/programID';
import sampleSize from '@/util/sampleSize';

import MarqueeText from 'vue-marquee-text-component';

export default {
    name: 'Search',
    components: { MarqueeText },
    data: () => ({
        query: null,
        searching: false,
        warning: false,
        error: false,
        exampleID: null
    }),
    computed: {
        hotlistArray() {
            const hotlistSnapshot = this.$store.state.hotlistSnapshot;
            if (!hotlistSnapshot) return null;

            const hotlistArray = Object.keys(hotlistSnapshot)
                .slice(0, 25)
                .map((key) => ({ id: key, ...hotlistSnapshot[key] }));

            return hotlistArray;
        },
        hotlistSnapshotKeys() {
            return this.hotlistArray.map((program) => program.id);
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
            const isHTTP = isURL && Math.random() < 0.5;
            this.exampleID =
                (isHTTP ? 'https://' : '') +
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
