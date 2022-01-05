<template>
    <div>
        <Navbar />
        <Dashboard
            :hotlistData="hotlistData"
            :uniquePrograms="uniquePrograms"
            :votesVolume="votesVolume"
            :forksVolume="forksVolume"
        />
    </div>
</template>

<script>
import api from '@/services/api';

import Navbar from '@/components/Navbar.vue';
import Dashboard from '@/components/Dashboard.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Dashboard
    },
    data: () => ({
        hotlistData: [],
        uniquePrograms: null,
        votesVolume: null,
        forksVolume: null
    }),
    async created() {
        const hotlistData = await api.fetchHotlistData('week');
        this.hotlistData = hotlistData;
    },
    mounted() {
        Apex.colors = ['#570df8', '#00E396', '#FEB019', '#FF4560', '#008FFB'];
    }
};
</script>
