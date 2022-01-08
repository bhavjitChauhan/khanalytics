import axios from 'axios';

const BASE_URL = process.env.VUE_APP_BASE_URL;

const instance = axios.create({
    baseURL: BASE_URL
});

export default {
    async fetchHotlistData(param = 'day') {
        const response = await instance.get(`hotlist/${param}`);
        return response.data;
    },
    async fetchStatisticsData(param = '') {
        const response = await instance.get(`statistics/${param}`);
        return response.data;
    }
};
