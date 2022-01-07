export default function InlineWorker(fn) {
    let blob = new Blob(['onmessage = ', fn.toString()], {
        type: 'text/javascript'
    });
    let url = URL.createObjectURL(blob);

    return new Worker(url);
}
