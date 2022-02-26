import ARIMA from 'arima';

self.addEventListener('message', ({ data: { series, name, n = 10 } }) => {
    const arima = new ARIMA({
        auto: true,
        verbose: process.env.NODE_ENV != 'production'
    });
    const ts = series.map(val => val[1]);

    arima.train(ts);

    const [pred, _errors] = arima.predict(n);

    postMessage([name, pred]);
});
