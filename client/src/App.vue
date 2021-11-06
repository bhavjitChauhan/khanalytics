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
        await api.fetchHotlistData((chunk) => {
            chunk = JSON.parse(chunk);
            switch (Object.keys(chunk)[0]) {
                case 'data':
                    this.hotlistData = chunk.data;
                    break;
                case 'uniquePrograms':
                    this.uniquePrograms = new Number(chunk.uniquePrograms);
                    break;
                case 'votesVolume':
                    this.votesVolume = new Number(chunk.votesVolume);
                    break;
                case 'forksVolume':
                    this.forksVolume = new Number(chunk.forksVolume);
                    break;
            }
        }, 'week');
    },
    mounted() {
        Apex.colors = ['#570df8', '#00E396', '#FEB019', '#FF4560', '#008FFB'];
    }
};
</script>
