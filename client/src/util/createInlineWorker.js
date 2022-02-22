const createInlineWorker = (fn) => {
    const blob = new Blob(['self.onmessage = ', fn.toString()], {
        type: 'text/javascript'
    });
    const url = URL.createObjectURL(blob);

    return new Worker(url);
};

export default createInlineWorker;
