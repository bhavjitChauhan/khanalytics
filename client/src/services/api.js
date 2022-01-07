import axios from 'axios';


const BASE_URL = process.env.VUE_APP_BASE_URL;

const instance = axios.create({
    baseURL: BASE_URL
});

export default {
    async fetchHotlistData(period = 'day') {
        const response = await instance.get(`hotlist/${period}`);
        return response.data;
    },
    async fetchStatisticsData() {
        const response = await instance.get('statistics');
        return response.data;
    }
}
