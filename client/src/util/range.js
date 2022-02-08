export default function range(start, stop, step = 1) {
    let arr = [start],
        x = start;
    while (x + step < stop) {
        arr.push((x += step));
    }
    arr[arr.length - 1] = stop;
    return arr;
}
