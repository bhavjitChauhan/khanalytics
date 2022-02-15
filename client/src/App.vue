<template>
    <div>
        <Navbar />
        <Page>
            <div
                v-if="width <= 425"
                class="m-2 alert alert-warning"
            >
                <div class="flex-1">
                    <label>
                        <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon> &nbsp; Khanalytics is not optimized for mobile devices.
                    </label>
                </div>
            </div>
            <router-view />
        </Page>
        <Footer />
    </div>
</template>

<script>
import { setDarkMode } from '@/util/darkMode';

import Navbar from '@/components/Navbar.vue';
import Page from '@/components/Page.vue';
import Footer from '@/components/Footer.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Page,
        Footer
    },
    computed: {
        width() {
            return document.documentElement.clientWidth;
        }
    },
    async created() {
        await Promise.all([
            await this.$store.dispatch('fetchStatisticsData'),
            await this.$store.dispatch('fetchHotlistSnapshot'),
            await this.$store.dispatch('fetchPerformanceTopData')
        ]);
    },
    mounted() {
        setDarkMode();
    }
};
</script>
