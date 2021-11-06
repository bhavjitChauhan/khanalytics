import axios from 'axios';


const BASE_URL = process.env.VUE_APP_BASE_URL;

export default {
    fetchHotlistData(callback, period = 'day') {
        const instance = axios.create({
            baseURL: BASE_URL,
            onDownloadProgress: progressEvent => {
                const dataChunk = progressEvent.currentTarget.response;
                if (dataChunk.includes('\n')) {
                    const dataChunks = dataChunk.split('\n');
                    callback(dataChunks[dataChunks.length - 2]);
                }
            }
        });
        return instance.get(`hotlist/${period}`);
    }
}
