<template>
    <div class="m-2 shadow-lg navbar bg-primary text-neutral-content rounded-box">
        <!-- todo: replace with filtered logo -->
        <div class="px-2 mx-2 navbar-start">
            <router-link to="/">
                <img
                    alt="Khanaltics Logo"
                    src="../assets/logo_inverted.png"
                    class="h-8"
                />
            </router-link>
        </div>
        <div class="hidden px-2 mx-2 navbar-center lg:flex">
            <div class="flex items-stretch">
                <router-link
                    class="btn btn-ghost btn-sm rounded-btn"
                    to="/"
                >Home</router-link>
                <router-link
                    class="btn btn-ghost btn-sm rounded-btn"
                    to="/dashboard"
                >Dashboard</router-link>
                <router-link
                    class="btn btn-ghost btn-sm rounded-btn"
                    to="/about"
                >About</router-link>
            </div>
        </div>
        <div class="px-2 ml-2 navbar-end">
            <form
                id="navbar_search_form"
                class="space-x-2"
                @submit.prevent="search"
            >
                <input
                    type="text"
                    placeholder="Program ID"
                    :value="query"
                    class="input input-ghost input-sm"
                    @input="event => query = event.target.value"
                >
                <button
                    type="submit"
                    form="navbar_search_form"
                    class="btn btn-ghost btn-circle btn-sm"
                    :class="{ loading: searching }"
                >
                    <font-awesome-icon
                        v-if="!searching"
                        icon="search"
                    />
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import isValidProgramID from '@/util/isValidProgramID';

export default {
    name: 'Navbar',
    data: () => ({
        query: null,
        searching: false,
        error: false
    }),
    methods: {
        search() {
            this.error = null;
            try {
                isValidProgramID(this.query);
            } catch (err) {
                this.$router.push({
                    name: 'search',
                    params: { query: this.query }
                });
                return;
            }

            this.searching = true;

            this.$router.push({
                name: 'program',
                params: { id: this.query }
            });

            this.searching = false;
            this.query = null;
        }
    }
};
</script>

<style scoped>
::placeholder {
    color: whitesmoke;
}
:focus::placeholder {
    color: gray;
}
</style>
