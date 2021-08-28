<template>
    <div>
        <Dashboard :hotlistData="hotlistData" />
    </div>
</template>

<script>
import api from '@/services/api';

import Dashboard from '@/components/Dashboard.vue';

export default {
    name: 'App',
    components: {
        Dashboard
    },
    data: () => ({
        hotlistData: []
    }),
    async created() {
        const response = await api.fetchHotlistData();
        this.hotlistData = response.data;
    }
};
</script>
