import { createStore } from 'vuex'

import api from '@/services/api';


export default createStore({
    state: {
        statisticsData() {
            return [];
        },
        hotlistSnapshot() {
            return {};
        },
        performanceTopData() {
            return [];
        }
    },
    getters: {
        getProgramByTitle: (state) => (title) => {
            const hotlistSnapshot = state.hotlistSnapshot;
            if (!hotlistSnapshot) return null;

            const id = Object.keys(hotlistSnapshot).find(key => hotlistSnapshot[key].title == title);
            const program = {
                ...hotlistSnapshot[id],
                id
            };

            return program;
        }
    },
    mutations: {
        setStatisticsData(state, data) {
            state.statisticsData = data;
        },
        setHotlistSnapshot(state, snapshot) {
            state.hotlistSnapshot = snapshot;
        },
        setPerformanceTopData(state, data) {
            state.performanceTopData = data;
        }
    },
    actions: {
        async fetchStatisticsData({ commit }) {
            const data = await api.fetchStatisticsData();
            commit('setStatisticsData', data);
        },
        async fetchHotlistSnapshot({ commit }) {
            const data = await api.fetchKhanLabs('scratchpads/top?sort=3&limit=100&projection={"scratchpads":1}');
            const snapshot = {};
            const scratchpads = data.scratchpads;
            for (const i in scratchpads) {
                const scratchpad = scratchpads[i];
                const id = scratchpad.url.split('/')[5];
                snapshot[id] = {
                    title: scratchpad.title || 'None',
                    rank: parseInt(i, 10) + 1,
                    votes: scratchpad.sumVotesIncremented,
                    forks: scratchpad.spinoffCount,
                    author: scratchpad.authorNickname,
                    authorID: scratchpad.authorKaid.slice(5)
                };
            }
            commit('setHotlistSnapshot', snapshot);
        },
        async fetchPerformanceTopData({ commit }) {
            const data = await api.fetchPerformanceData('top/10');
            commit('setPerformanceTopData', data);
        }
    },
    modules: {}
});
