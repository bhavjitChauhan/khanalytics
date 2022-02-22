import { allDigits } from './regex';

const beforeRecording = created => {
    if (created instanceof Date) created = created.getTime();
    else if (!allDigits(created)) return beforeRecording(new Date(created));
    return created < 1629266402000;
}

const beforeDiscussionRecording = created => {
    if (created instanceof Date) created = created.getTime();
    else if (!allDigits(created)) return beforeRecording(new Date(created));
    return created < 1642651200000;
}

export { beforeRecording, beforeDiscussionRecording };
