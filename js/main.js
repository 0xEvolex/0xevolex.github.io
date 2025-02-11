import { initializeServerConfig } from './modules/server.js';
import { updateServerTimeClockElement, updateUserTimeClockElement, initializeGmtOffsetDropdown } from './modules/clocks.js';
import { initializeAudioControls } from './modules/audio.js';
import { populateEventTables } from './modules/table.js';
import { updateEventCountdowns } from './modules/events.js';
import { initializePreRegisterButton, scheduleEventReminders } from './modules/scheduler.js';
import { populateVoices } from './modules/tts.js';
import { initializeBlacklist } from './modules/blacklist.js';
import { initializeIntroduction } from './modules/introduction.js';

function updateTimes() {
    updateServerTimeClockElement();
    updateUserTimeClockElement();
    updateEventCountdowns();
}

document.addEventListener("DOMContentLoaded", async () => {
    await initializeServerConfig();
    populateEventTables();
    updateTimes();
    setInterval(updateTimes, 1000);
    scheduleEventReminders();
    initializeAudioControls();
    initializePreRegisterButton();
    populateVoices();
    initializeBlacklist();
    initializeGmtOffsetDropdown();
    initializeIntroduction();
});