import { serverTimezone, serverDelay, serverEvents } from './server.js';
import { getServerDateTime } from './time.js';
import { announceEventStart } from './tts.js';
import { scheduleEventReminders } from './scheduler.js';

export function getNextEvent(eventDetails, serverTime) {
    const daysToCheck = 14;
    for (let i = 0; i < daysToCheck; i++) {
        const day = serverTime.clone().add(i, 'days').format('dddd');
        const times = eventDetails[day];
        if (!times) continue;

        for (const time of times) {
            const eventTime = serverTime.clone().startOf('day').add(i, 'days').tz(serverTimezone).set({
                hour: parseInt(time.split(':')[0]),
                minute: parseInt(time.split(':')[1])
            });
            if (eventTime.isAfter(serverTime)) {
                return eventTime;
            }
        }
    }
    return null;
}

export function getEventStatus(nextEvent, serverTime, eventDetails) {
    const previousEvent = getPreviousEvent(eventDetails, serverTime);
    const registrationPeriod = moment.duration(eventDetails.pre_registration).asMilliseconds();
    const eventDuration = moment.duration(eventDetails.duration).asMilliseconds();

    const timeUntilEvent = nextEvent.diff(serverTime);
    const timeSincePreviousEvent = previousEvent ? serverTime.diff(previousEvent) : Infinity;

    if (timeUntilEvent <= registrationPeriod) {
        if (eventDetails.registration_needed) {
            return { text: `Registration (${formatDuration(timeUntilEvent)})`, class: 'registration' };
        } else {
            return { text: `Starting (${formatDuration(timeUntilEvent)})`, class: 'registration' };
        }
    }

    if (timeSincePreviousEvent >= 0 && timeSincePreviousEvent <= eventDuration) {
        const remainingActiveTime = eventDuration - timeSincePreviousEvent;
        return { text: `Running (${formatDuration(remainingActiveTime)})`, class: 'active' };
    }

    return { text: getRemainingTime(nextEvent, serverTime), class: '' };
}

export function getRemainingTime(nextEvent, serverTime) {
    const duration = moment.duration(nextEvent.diff(serverTime));
    const hours = duration.asHours();

    if (hours < 0) {
        return "Starting now";
    } else if (hours > 48) {
        const days = Math.floor(hours / 24);
        return `> ${days} days`;
    } else if (hours > 24) {
        return `> 1 day`;
    } else {
        const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
        const minutes = String(duration.minutes()).padStart(2, '0');
        const seconds = String(duration.seconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
}

export function getEventTime(nextEvent) {
    const userTimezone = localStorage.getItem('userTimezone') || moment.tz.guess();
    const userTime = nextEvent.clone().tz(userTimezone);
    const now = moment().tz(userTimezone);
    if (userTime.isSame(now, 'day')) {
        return userTime.format('HH:mm');
    } else {
        return userTime.format('ddd HH:mm');
    }
}

function getPreviousEvent(eventDetails, serverTime) {
    const daysToCheck = 14;
    let closestPastEvent = null;

    for (let i = 0; i < daysToCheck; i++) {
        const day = serverTime.clone().subtract(i, 'days').format('dddd');
        const times = eventDetails[day];
        if (!times) continue;

        for (const time of times.reverse()) {
            const eventTime = serverTime.clone().startOf('day').subtract(i, 'days').tz(serverTimezone).set({
                hour: parseInt(time.split(':')[0]),
                minute: parseInt(time.split(':')[1])
            });

            if (eventTime.isBefore(serverTime) && (!closestPastEvent || eventTime.isAfter(closestPastEvent))) {
                closestPastEvent = eventTime;
            }
        }
    }
    return closestPastEvent;
}

function formatDuration(duration) {
    const durationObj = moment.duration(duration);
    const hours = String(durationObj.hours()).padStart(2, '0');
    const minutes = String(durationObj.minutes()).padStart(2, '0');
    const seconds = String(durationObj.seconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

let announcedEvents = {};

export function updateEventCountdowns() {
    const eventTable = document.getElementById('event-table');
    if (!eventTable) return; // Exit if the table is not found

    const { serverTime } = getServerDateTime(serverTimezone, serverDelay);
    const eventRows = eventTable.querySelectorAll('tr');

    const events = [];

    eventRows.forEach(row => {
        const nextEvent = moment(row.getAttribute('data-event-time'));
        const remainingTimeElement = row.querySelector('.remaining-time');
        if (remainingTimeElement) {
            remainingTimeElement.textContent = getRemainingTime(nextEvent, serverTime);
        }

        const eventName = row.querySelector('.event-name').textContent.trim();
        const eventDetails = serverEvents[eventName];
        if (!eventDetails) return;

        const eventStatus = getEventStatus(nextEvent, serverTime, eventDetails);
        const statusCell = row.querySelector('.event-status');
        const eventTimeCell = row.querySelector('.event-time');

        if (statusCell.textContent !== eventStatus.text || statusCell.className !== eventStatus.class) {
            statusCell.textContent = eventStatus.text;
            statusCell.className = `event-status ${eventStatus.class}`;
        }

        const eventDuration = moment.duration(eventDetails.duration).asMilliseconds();
        const remainingTime = nextEvent.diff(serverTime);
        if (remainingTime <= 0 && statusCell.className.includes('registration')) {
            const activeEndTime = nextEvent.clone().add(eventDuration, 'milliseconds');
            row.setAttribute('data-event-time', activeEndTime.toISOString());
            statusCell.textContent = `Running (${formatDuration(eventDuration)})`;
            statusCell.className = 'event-status active';

            eventTimeCell.textContent = getEventTime(activeEndTime);

            // Announce event start if reminder is set
            const isReminded = localStorage.getItem(`remind-${eventName}`) === 'true';
            if (isReminded && !announcedEvents[eventName]) {
                announceEventStart(eventName);
                announcedEvents[eventName] = true;
                scheduleEventReminders(eventName); // Recalculate reminders only for the event that just started
            }
        }

        const reminderTime = parseInt(localStorage.getItem('previousPreRegisterValue')) || 0;
        if (remainingTime === reminderTime * 60000) {
            const isReminded = localStorage.getItem(`remind-${eventName}`) === 'true';
            if (isReminded) {
                announceEventReminder(eventName, reminderTime);
            }
        }

        if (remainingTime <= 0 && statusCell.className.includes('active')) {
            const nextEvent = getNextEvent(eventDetails, serverTime);
            if (nextEvent) {
                row.setAttribute('data-event-time', nextEvent.toISOString());
                const eventStatus = getEventStatus(nextEvent, serverTime, eventDetails);
                statusCell.textContent = eventStatus.text;
                statusCell.className = `event-status ${eventStatus.class}`;

                eventTimeCell.textContent = getEventTime(nextEvent);
            }
        }

        events.push({
            row,
            eventStatus,
            remainingTime,
            nextEvent
        });
    });

    // Sort events by status and remaining time
    events.sort((a, b) => {
        const statusOrder = { 'active': 0, 'registration': 1, '': 2 };
        if (statusOrder[a.eventStatus.class] !== statusOrder[b.eventStatus.class]) {
            return statusOrder[a.eventStatus.class] - statusOrder[b.eventStatus.class];
        }
        return a.nextEvent.diff(b.nextEvent);
    });

    // Append sorted events to the table
    const eventTableBody = eventTable.getElementsByTagName('tbody')[0];
    eventTableBody.innerHTML = '';
    events.forEach(event => {
        eventTableBody.appendChild(event.row);
    });

    // Update Genie Reset and Fortress War timers
    const genieResetEvent = serverEvents["Genie Reset"];
    const fortressWarEvent = serverEvents["Fortress War"];
    const calendarResetEvent = serverEvents["Calendar Reset"];

    if (genieResetEvent) {
        const nextgenieReset = getNextEvent(genieResetEvent, serverTime);
        if (nextgenieReset) {
            const genieResetTimeElement = document.getElementById('genie-reset-time');
            genieResetTimeElement.textContent = getRemainingTime(nextgenieReset, serverTime);

            // Update status and announce event start if needed
            const genieResetStatus = getEventStatus(nextgenieReset, serverTime, genieResetEvent);
            if (genieResetStatus.class === 'registration' || genieResetStatus.class === 'active') {
                genieResetTimeElement.className = `timer-widget-time ${genieResetStatus.class}`;
                if (genieResetStatus.class === 'active' && !announcedEvents["Daily Reset"]) {
                    announceEventStart("Daily Reset");
                    announcedEvents["Daily Reset"] = true;
                }
            } else {
                genieResetTimeElement.className = 'timer-widget-time';
            }
        }
    }
    if (fortressWarEvent) {
        const nextFortressWar = getNextEvent(fortressWarEvent, serverTime);
        if (nextFortressWar) {
            const fortressWarTimeElement = document.getElementById('fortress-war-time');
            const fortressWarStatus = getEventStatus(nextFortressWar, serverTime, fortressWarEvent);
    
            if (fortressWarStatus.class === 'registration' || fortressWarStatus.class === 'active') {
                fortressWarTimeElement.className = `timer-widget-time ${fortressWarStatus.class}`;
                fortressWarTimeElement.textContent = fortressWarStatus.text;
                if (fortressWarStatus.class === 'active' && !announcedEvents["Fortress War"]) {
                    announceEventStart("Fortress War");
                    announcedEvents["Fortress War"] = true;
                }
            } else {
                fortressWarTimeElement.className = 'timer-widget-time';
                fortressWarTimeElement.textContent = getRemainingTime(nextFortressWar, serverTime);
            }
        }
    }
    if (calendarResetEvent) {
        const nextCalendarReset = getNextEvent(calendarResetEvent, serverTime);
        if (nextCalendarReset) {
            const calendarResetTimeElement = document.getElementById('calendar-reset-time');
            calendarResetTimeElement.textContent = getRemainingTime(nextCalendarReset, serverTime);
    
            // Update status and announce event start if needed
            const calendarResetStatus = getEventStatus(nextCalendarReset, serverTime, calendarResetEvent);
            if (calendarResetStatus.class === 'registration' || calendarResetStatus.class === 'active') {
                calendarResetTimeElement.className = `timer-widget-time ${calendarResetStatus.class}`;
                if (calendarResetStatus.class === 'active' && !announcedEvents["Calendar Reset"]) {
                    announceEventStart("Calendar Reset");
                    announcedEvents["Calendar Reset"] = true;
                }
            } else {
                calendarResetTimeElement.className = 'timer-widget-time';
            }
        }
    }
}