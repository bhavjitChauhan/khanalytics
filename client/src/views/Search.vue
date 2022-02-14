<template>
    <div class="min-h-screen hero bg-base-200">
        <div class="w-full text-center hero-content">
            <div class="w-1/2">
                <h1 class="mb-8 -mt-32 text-5xl font-bold">
                    Lookup
                </h1>
                <div class="rows-2">
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
                                placeholder="Program ID"
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
            </div>
        </div>
    </div>
</template>

<script>
import isValidProgramID from '@/util/isValidProgramID';

export default {
    name: 'Search',
    data: () => ({
        query: null,
        searching: false,
        warning: false,
        error: false
    }),
    methods: {
        search() {
            this.warning = this.error = null;
            try {
                isValidProgramID(this.query);
            } catch (err) {
                this.warning = err.message;
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
                this.error = err.message;
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
    }
};
</script>
