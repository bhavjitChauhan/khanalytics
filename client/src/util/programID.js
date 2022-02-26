function isValidProgramID(input) {
    const type = typeof input;
    if (type != 'string' && type != 'number') throw new TypeError('Expected a string or number');
    if (type == 'number') {
        if (input < 0) throw new RangeError('Expected a positive number');
        if (input > Number.MAX_SAFE_INTEGER) throw new RangeError('Expected a number less than ' + Number.MAX_SAFE_INTEGER);
        input = input.toString();
    }
    const length = input.length;
    if (length < 0) throw new RangeError('Expected a non-empty string');
    if (length != 9 && length != 10 && length != 16) throw new RangeError('Expected a valid string length');
    if (!/^\d+$/.test(input)) throw new RangeError('Expected a string of digits');
    return true;
}

function extractProgramID(input) {
    const regex = /khanacademy.org\/((cs)|(computer\-programming))\/[\w-]+\/(\d+)/i;
    if (regex.test(input)) {
        const match = regex.exec(input);
        input = match[4];
    }
    if (isValidProgramID(input)) return input;
}


export default extractProgramID;
export {
    isValidProgramID,
    extractProgramID
}
