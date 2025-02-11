import { getServerDateTime, getUserDateTime, setUserTimezone } from './time.js';
import { populateEventTables } from './table.js';

export function updateServerTimeClockElement() {
    const serverTimeElement = document.getElementById('server-time');
    const { serverTime, offset } = getServerDateTime();
    serverTimeElement.textContent = `Server: ${serverTime.format('ddd HH:mm:ss')} GMT${offset}`;
}

export function updateUserTimeClockElement(refreshTable = false) {
    const userTimeElement = document.getElementById('user-time');
    const { userTime, offset } = getUserDateTime();
    userTimeElement.textContent = `You: ${userTime.format('ddd HH:mm:ss')}`;
    if (refreshTable) {
        populateEventTables();
    }
}

export function initializeGmtOffsetDropdown() {
    const gmtOffsetDropdown = document.getElementById('gmt-offset-dropdown');
    for (let i = -12; i <= 14; i++) {
        const offset = i >= 0 ? `+${i}` : `${i}`;
        const option = document.createElement('option');
        option.value = offset;
        option.textContent = `GMT${offset}`;
        gmtOffsetDropdown.appendChild(option);
    }

    const userTimezone = localStorage.getItem('userTimezone') || moment.tz.guess();
    const userOffset = moment().tz(userTimezone).format('Z').replace(':00', '').replace(/^([+-])0/, '$1');
    gmtOffsetDropdown.value = userOffset;

    gmtOffsetDropdown.addEventListener('change', (event) => {
        const selectedOffset = event.target.value;
        setUserTimezone(selectedOffset);
        updateUserTimeClockElement(true);
    });
}