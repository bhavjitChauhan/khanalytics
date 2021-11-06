const calculateVotesVolume = (data) => {
    let totalVotes = 0;
    const programIDs = [
        ...new Set(data.map((program) => program.program_id))
    ];
    for (let i = 0; i < programIDs.length; i++) {
        const entries = data.filter(
            (program) => program.program_id == programIDs[i]
        );
        const earliestVoteCount = Math.min(
            ...entries.map((program) => program.votes)
        );
        const latestVoteCount = Math.max(
            ...entries.map((program) => program.votes)
        );
        totalVotes += latestVoteCount - earliestVoteCount;
    }
    return totalVotes;
};

const calculateForksVolume = (data) => {
    let totalForks = 0;
    const programIDs = [
        ...new Set(data.map((program) => program.program_id))
    ];
    for (let i = 0; i < programIDs.length; i++) {
        const entries = data.filter(
            (program) => program.program_id == programIDs[i]
        );
        const earliestForkCount = Math.min(
            ...entries.map((program) => program.forks)
        );
        const latestForkCount = Math.max(
            ...entries.map((program) => program.forks)
        );
        totalForks += latestForkCount - earliestForkCount;
    }
    return totalForks;
};

const calculateUniquePrograms = (data) => {
    const programIDs = new Set(
        data.map((program) => program.program_id)
    );
    return programIDs.size;
};


module.exports = {
    calculateVotesVolume: calculateVotesVolume,
    calculateForksVolume,
    calculateUniquePrograms
};
