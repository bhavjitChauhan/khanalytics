import timeseries from 'timeseries-analysis';

self.addEventListener('message', ({ data: { series } }) => {
    const t = new timeseries.main(series);

    postMessage('Not implemented');
});
