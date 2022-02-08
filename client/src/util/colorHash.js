import ColorHash from 'color-hash';
import range from './range';

export default new ColorHash({
    hue: range(0, 360, 15),
    saturation: range(0.75, 1, 0.05),
    lightness: range(0.25, 0.5, 0.05)
});
