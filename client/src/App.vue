<template>
    <div>
        <Navbar />
        <router-view />
        <Footer />
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Footer
    },
    async created() {
        await Promise.all([
            await this.$store.dispatch('fetchStatisticsData'),
            await this.$store.dispatch('fetchHotlistSnapshot'),
            await this.$store.dispatch('fetchPerformanceTopData'),
        ]);
    }
};
</script>
