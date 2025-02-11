import { logInfo } from './logger.js';
import { getNextEvent } from './events.js';
import { announceEventReminder } from './tts.js';
import { getServerDateTime } from './time.js';
import { serverTimezone, serverDelay, serverEvents } from './server.js';

export let isPreRegisterActive = localStorage.getItem('isPreRegisterActive');

if (isPreRegisterActive === null) {
    isPreRegisterActive = true;
    localStorage.setItem('isPreRegisterActive', 'true');
} else {
    isPreRegisterActive = isPreRegisterActive === 'true';
}

let reminderTimeouts = [];

export function initializePreRegisterButton() {
    const preRegisterButton = document.getElementById('btn-pre-alert');
    const preRegisterIcon = document.getElementById('ic-pre-alert');
    const preRegisterSlider = document.getElementById('pre-alert-slider');
    const preRegisterValue = document.getElementById('pre-alert-value');

    let previousPreRegisterValue = parseInt(localStorage.getItem('previousPreRegisterValue')) || preRegisterSlider.value;

    const updatePreRegisterValueText = (value) => {
        const minutes = 31 - value;
        const minuteText = minutes === 1 ? 'minute' : 'minutes';
        preRegisterValue.textContent = `Sound Alert: ${minutes} ${minuteText} before event`;
    };

    if (isPreRegisterActive) {
        preRegisterButton.classList.add('active');
        preRegisterIcon.style.color = 'green';
        preRegisterSlider.disabled = false;
        preRegisterSlider.classList.remove('disabled');
        preRegisterSlider.value = previousPreRegisterValue;
        updatePreRegisterValueText(preRegisterSlider.value);
    } else {
        preRegisterButton.classList.remove('active');
        preRegisterIcon.style.color = 'red';
        preRegisterSlider.disabled = true;
        preRegisterSlider.classList.add('disabled');
        updatePreRegisterValueText(preRegisterSlider.value);
        clearScheduledReminders(); // Clear all scheduled reminders
    }

    preRegisterButton.addEventListener('click', () => {
        isPreRegisterActive = preRegisterButton.classList.toggle('active');
        preRegisterIcon.style.color = isPreRegisterActive ? 'green' : 'red';
        preRegisterSlider.disabled = !isPreRegisterActive;
        preRegisterSlider.classList.toggle('disabled', !isPreRegisterActive);
        if (isPreRegisterActive) {
            preRegisterSlider.value = previousPreRegisterValue;
            updatePreRegisterValueText(preRegisterSlider.value);
            scheduleEventReminders();
        } else {
            previousPreRegisterValue = preRegisterSlider.value;
            updatePreRegisterValueText(preRegisterSlider.value);
            clearScheduledReminders();
        }
        localStorage.setItem('isPreRegisterActive', isPreRegisterActive);
    });

    // Update the displayed value when the slider is moved
    preRegisterSlider.addEventListener('input', () => {
        updatePreRegisterValueText(preRegisterSlider.value);
    });
    
    preRegisterSlider.addEventListener('change', () => {
        localStorage.setItem('previousPreRegisterValue', preRegisterSlider.value);
        if (isPreRegisterActive) {
            scheduleEventReminders(); // Schedule reminders when the slider value changes
        }
    });

    // Set initial slider value display
    updatePreRegisterValueText(preRegisterSlider.value);
}

export function clearScheduledReminders(eventName = null) {
    if (eventName) {
        reminderTimeouts = reminderTimeouts.filter(timeout => {
            if (timeout.eventName === eventName) {
                clearTimeout(timeout.timeoutId);
                return false;
            }
            return true;
        });
    } else {
        reminderTimeouts.forEach(timeout => clearTimeout(timeout.timeoutId));
        reminderTimeouts = [];
    }
}

export function scheduleEventReminders(eventName = null) {
    // Clear existing timeouts
    clearScheduledReminders(eventName);

    if (!isPreRegisterActive) {
        logInfo(`Event registration reminders are disabled, no reminders will be scheduled.`);
        return;
    }

    const sliderValue = parseInt(localStorage.getItem('previousPreRegisterValue')) || 30;
    const reminderTime = 31 - sliderValue;

    logInfo(`Scheduling event reminders with reminder time: ${reminderTime} minute/s`);

    if (reminderTime === 0) {
        console.log(`Reminder time is set to 0 minutes, no reminders will be scheduled.`);
        return;
    }

    const { serverTime } = getServerDateTime(serverTimezone, serverDelay);

    const eventsToSchedule = eventName ? { [eventName]: serverEvents[eventName] } : serverEvents;

    for (const [eventName, eventDetails] of Object.entries(eventsToSchedule)) {
        const nextEvent = getNextEvent(eventDetails, serverTime);
        if (nextEvent) {
            const timeUntilEvent = nextEvent.diff(serverTime, 'milliseconds');
            const timeUntilReminder = timeUntilEvent - reminderTime * 60000;

            if (timeUntilReminder > 0) {
                logInfo(`${eventName} scheduled. Reminder in: ${(timeUntilReminder / 60000).toFixed(2)} minutes, Start in: ${(timeUntilEvent / 60000).toFixed(2)} minutes`);
                const reminderTimeout = setTimeout(() => {
                    announceEventReminder(eventName, reminderTime);
                }, timeUntilReminder);
                reminderTimeouts.push({ eventName, timeoutId: reminderTimeout });
            } else {
                logInfo(`${eventName} not scheduled. Event is too close.`);
            }
        }
    }
}