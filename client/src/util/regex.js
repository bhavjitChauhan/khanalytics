const allDigits = (str) => /^\d+$/.test(str);

const allLetters = (str) => /^[a-zA-Z]+$/.test(str);

const allAlphaNumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

export { allDigits, allLetters, allAlphaNumeric };
