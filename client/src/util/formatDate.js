export default function formatDate(timestamp, full = false) {
    const options = {
        hour12: false,
        month: 'short',
        day: 'numeric',
        hour: 'numeric'
    };
    if (full) {
        options.minute = 'numeric';
        options.second = 'numeric';
    }
    // todo: match format with other charts
    return new Date(timestamp).toLocaleString('en-US', options) + (full ? '' : ':00')
};
