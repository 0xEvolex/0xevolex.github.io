import { getNextEvent, getEventStatus, getRemainingTime, getEventTime } from './events.js';
import { getServerDateTime } from './time.js';
import { serverEvents } from './server.js';

const tableHeaders = [
    { title: "Event Name", tooltip: "", className: "event-name" },
    { title: "Remaining Time", tooltip: "Status of the event: Upcoming, Registration or Active.", className: "event-status" },
    { title: "Register Method", tooltip: "Method to register for the event.", className: "register-method" },
    { title: "Next Event Date", tooltip: "Event date is displayed in your local time, not server time.", className: "event-time" },
    { title: "Sound", tooltip: "Sound settings for the event. Will be overwritten by the global sound settings.", className: "event-sound" }
];

export function populateEventTables() {
    const tableContainer = document.getElementById('table-container');

    const createTableHeaders = () => {
        return tableHeaders.map((header, index) => `
            <th title="${header.tooltip}" class="${header.className}" data-index="${index}">
                ${header.title}
            </th>
        `).join('');
    };

    const createTableStructure = (tableId) => {
        return `
            <div class="table-wrapper">
                <table id="${tableId}" class="display" style="width: 100%;">
                    <thead>
                        <tr>${createTableHeaders()}</tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        `;
    };
    
    tableContainer.innerHTML = `
    <div class="table-column">${createTableStructure('event-table')}</div>
    `;

    const eventTable = document.getElementById('event-table').getElementsByTagName('tbody')[0];
    const { serverTime } = getServerDateTime();

    const events = [];

    for (const [eventName, eventDetails] of Object.entries(serverEvents)) {
        const isBlacklisted = localStorage.getItem(`blacklist-${eventName}`) === 'true';
        if (isBlacklisted) continue;

        const nextEvent = getNextEvent(eventDetails, serverTime);
        if (!nextEvent) continue;

        const eventStatus = getEventStatus(nextEvent, serverTime, eventDetails);
        const remainingTime = getRemainingTime(nextEvent, serverTime);
        const eventTime = getEventTime(nextEvent);

        if (localStorage.getItem(`remind-${eventName}`) === null) {
            localStorage.setItem(`remind-${eventName}`, 'true');
        }

        const isReminded = localStorage.getItem(`remind-${eventName}`) === 'true';
        const bellClass = isReminded ? 'fa-bell' : 'fa-bell-slash';
        const bellColor = isReminded ? 'green' : 'red';
        const registerMethod = eventDetails.register_method || 'NO INFO';

        // Handle Genie Reset, Fortress War, and Calendar Reset separately
        if (eventName === "Genie Reset") {
            document.getElementById('genie-reset-time').textContent = remainingTime;
            continue;
        } else if (eventName === "Fortress War") {
            const fortressWarTimeElement = document.getElementById('fortress-war-time');
            const fortressWarStatus = getEventStatus(nextEvent, serverTime, eventDetails);
            if (fortressWarStatus.class === 'registration' || fortressWarStatus.class === 'active') {
                fortressWarTimeElement.className = `timer-widget-time ${fortressWarStatus.class}`;
                fortressWarTimeElement.textContent = fortressWarStatus.text;
            } else {
                fortressWarTimeElement.className = 'timer-widget-time';
                fortressWarTimeElement.textContent = remainingTime;
            }
            continue;
        } else if (eventName === "Calendar Reset") {
            document.getElementById('calendar-reset-time').textContent = remainingTime;
            continue;
        }

        events.push({
            eventName,
            eventStatus,
            remainingTime,
            eventTime,
            bellClass,
            bellColor,
            nextEvent,
            registerMethod
        });
    }

    // Sort events by status and remaining time
    events.sort((a, b) => {
        const statusOrder = { 'active': 0, 'registration': 1, '': 2 };
        if (statusOrder[a.eventStatus.class] !== statusOrder[b.eventStatus.class]) {
            return statusOrder[a.eventStatus.class] - statusOrder[b.eventStatus.class];
        }
        return a.nextEvent.diff(b.nextEvent);
    });

    // Append sorted events to the table
    events.forEach(event => {
        const eventRow = document.createElement('tr');
        eventRow.innerHTML = tableHeaders.map(header => {
            switch (header.className) {
                case 'event-status':
                    return `<td class="event-status ${event.eventStatus.class}">${event.eventStatus.text}</td>`;
                case 'event-time':
                    return `<td class="event-time">${event.eventTime}</td>`;
                case 'event-name':
                    return `<td class="event-name">${event.eventName}</td>`;
                case 'register-method':
                    return `<td class="register-method">${event.registerMethod}</td>`;
                case 'event-sound':
                    return `
                        <td class="event-sound">
                            <div class="remind-bell-container">
                                <i class="fa ${event.bellClass} remind-bell" style="color: ${event.bellColor};" data-event-name="${event.eventName}" title="Mute/Unmute ${event.eventName}"></i>
                            </div>
                        </td>`;
                default:
                    return '';
            }
        }).join('');

        // Add remaining-time data attribute for internal calculations
        eventRow.setAttribute('data-event-time', event.nextEvent.toISOString());

        eventTable.appendChild(eventRow);
    });

    document.querySelectorAll('.remind-bell-container').forEach(container => {
        container.addEventListener('click', toggleRemind);
    });

    const dataTable = $('#event-table').DataTable({
        paging: false, // Disable pagination
        searching: false, // Disable search
        info: false, // Disable info
        lengthChange: false, // Disable "Show X entries"
        ordering: false,
        colReorder: true,
        scrollY: 'calc(100vh - 200px)', // Set the height of the table
        scrollCollapse: true, // Allow the table to collapse when there are fewer rows
    });

    const currentColumnPositions = tableHeaders.map((header, index) => index);
    // Load column positions from localStorage if available
    const savedColumnPositions = JSON.parse(localStorage.getItem('columnPositions'));
    if (savedColumnPositions) {
        currentColumnPositions.length = 0;
        savedColumnPositions.forEach(pos => currentColumnPositions.push(pos));
    }
    
    // Apply saved column positions to DataTable
    dataTable.colReorder.order(currentColumnPositions, true);
    
    dataTable.on('column-reorder', function(e, settings, details) {
        const fromIndex = details.from;
        const toIndex = details.to;
        const fromColumn = tableHeaders[currentColumnPositions[fromIndex]].className;
        const toColumn = tableHeaders[currentColumnPositions[toIndex]].className;
    
        console.log(`COLUMN REORDER: FROM: ${fromIndex} (${fromColumn}) TO: ${toIndex} (${toColumn})`);
    
        // Update the current column positions
        const movedColumn = currentColumnPositions.splice(fromIndex, 1)[0];
        currentColumnPositions.splice(toIndex, 0, movedColumn);
    
        // Save the updated column positions to localStorage
        localStorage.setItem('columnPositions', JSON.stringify(currentColumnPositions));
    });
}

function toggleRemind(event) {
    const container = event.currentTarget;
    const bell = container.querySelector('.remind-bell');
    const eventName = bell.getAttribute('data-event-name');
    const isReminded = bell.classList.contains('fa-bell');

    if (isReminded) {
        bell.classList.remove('fa-bell');
        bell.classList.add('fa-bell-slash');
        bell.style.color = 'red';
        localStorage.setItem(`remind-${eventName}`, 'false');
    } else {
        bell.classList.remove('fa-bell-slash');
        bell.classList.add('fa-bell');
        bell.style.color = 'green';
        localStorage.setItem(`remind-${eventName}`, 'true');
    }
}