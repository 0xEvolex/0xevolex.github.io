import { serverTimezone, serverDelay } from './server.js';

const offsetToTimezone = {
    "-12": "Etc/GMT+12",
    "-11": "Etc/GMT+11",
    "-10": "Etc/GMT+10",
    "-9": "Etc/GMT+9",
    "-8": "Etc/GMT+8",
    "-7": "Etc/GMT+7",
    "-6": "Etc/GMT+6",
    "-5": "Etc/GMT+5",
    "-4": "Etc/GMT+4",
    "-3": "Etc/GMT+3",
    "-2": "Etc/GMT+2",
    "-1": "Etc/GMT+1",
    "0": "Etc/GMT",
    "+1": "Etc/GMT-1",
    "+2": "Etc/GMT-2",
    "+3": "Etc/GMT-3",
    "+4": "Etc/GMT-4",
    "+5": "Etc/GMT-5",
    "+6": "Etc/GMT-6",
    "+7": "Etc/GMT-7",
    "+8": "Etc/GMT-8",
    "+9": "Etc/GMT-9",
    "+10": "Etc/GMT-10",
    "+11": "Etc/GMT-11",
    "+12": "Etc/GMT-12",
    "+13": "Etc/GMT-13",
    "+14": "Etc/GMT-14"
};

export function getServerDateTime() {
    const delay = serverDelay * 1000;
    const serverTime = moment().tz(serverTimezone).subtract(delay, 'milliseconds');
    const serverDay = serverTime.format('dddd');
    let offset = moment.tz(serverTimezone).format('Z').replace(':00', '');
    offset = offset.replace(/^([+-])0/, '$1');
    return { serverTime, serverDay, offset };
}

export function getUserDateTime() {
    const userTimezone = localStorage.getItem('userTimezone') || moment.tz.guess();
    const userTime = moment().tz(userTimezone);
    let offset = userTime.format('Z').replace(':00', '');
    offset = offset.replace(/^([+-])0/, '$1');
    return { userTime, offset };
}

export function setUserTimezone(offset) {
    const userTimezone = offsetToTimezone[offset];
    if (userTimezone) {
        localStorage.setItem('userTimezone', userTimezone);
    }
}