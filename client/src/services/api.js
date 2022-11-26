import axios from 'axios';


const BASE_URL = process.env.VUE_APP_BASE_URL;

const instance = axios.create({
    baseURL: BASE_URL
});

export default {
    async fetch(url) {
        const response = await instance.get(url);
        return response.data;
    },
    async fetchKhanInternal(params) {
        const response = await instance.get(`/khan/internal/${params}`);
        return response.data;
    },
    async postKhanGraphQL(operation, body) {
        const response = await instance.post(`/khan/internal/graphql/${operation}`, body);
        return response.data;
    },
    async fetchHotlistData(param = 'day') {
        const response = await instance.get(`/hotlist/${param}`);
        return response.data;
    },
    async fetchStatisticsData(param = '') {
        const response = await instance.get(`/statistics/${param}`);
        return response.data;
    },
    async fetchPerformanceData(param) {
        if (!param) throw new Error('No param provided');
        const response = await instance.get(`/performance/${param}`);
        return response.data;
    },
    async postEmail(name, body) {
        const response = await instance.post(`/email`, {
            name,
            body
        });
        return response.data;
    }
};
