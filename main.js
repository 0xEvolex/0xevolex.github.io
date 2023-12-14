document.addEventListener('DOMContentLoaded', (event) => {
    switchTab('schedule');
});

function getSrvDt() {
    const date = new Date();

    const serverTime = new Intl.DateTimeFormat('en-US', { 
        timeZone: 'Europe/Helsinki',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    }).format(date);

    const serverDay = new Intl.DateTimeFormat('en-US', { 
        timeZone: 'Europe/Helsinki',
        weekday: 'short' 
    }).format(date);

    return [serverTime, serverDay];
}

function getUserDt() {
    const date = new Date();

    const userTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);

    const userDay = new Intl.DateTimeFormat('en-US', {
        weekday: 'short'
    }).format(date);

    return [userTime, userDay];
}

function switchTab(tabId) {
    const tabContents = document.getElementsByClassName('tab-content');

    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    document.getElementById(tabId).style.display = 'block';

    if (tabId === 'schedule') {
        const scheduleDiv = document.getElementById('schedule');

        let srvDtDiv = document.getElementById('srv-dt');
        let userDtDiv = document.getElementById('user-dt');
        let timeContainer = document.getElementById('time-container');

        if (srvDtDiv || userDtDiv || timeContainer) {
            scheduleDiv.removeChild(timeContainer);
            clearInterval(window.srvDtInterval);
        }

        const disclaimerDiv = document.createElement('div');
        disclaimerDiv.id = 'disclaimer';
        disclaimerDiv.className = 'disclaimer-container';
        disclaimerDiv.textContent = 'All event times are in GMT+2 (Server Time)';
        scheduleDiv.appendChild(disclaimerDiv);

        // Create a parent div for the time containers
        timeContainer = document.createElement('div');
        timeContainer.id = 'clock-container';
        timeContainer.className = 'clock-container';
        scheduleDiv.appendChild(timeContainer);

        srvDtDiv = document.createElement('div');
        srvDtDiv.id = 'srv-dt';
        srvDtDiv.className = 'servertime-container';
        timeContainer.appendChild(srvDtDiv);

        // Add a new div for user time
        userDtDiv = document.createElement('div');
        userDtDiv.id = 'user-dt';
        userDtDiv.className = 'usertime-container';
        timeContainer.appendChild(userDtDiv);

        // Update the server time and user time immediately
        const [serverTime, serverDay] = getSrvDt();
        srvDtDiv.textContent = `Server Time: ${serverTime}, ${serverDay}`;

        const [userTime, userDay] = getUserDt();
        userDtDiv.textContent = `User Time: ${userTime}, ${userDay}`;

        // Then update them every second
        window.srvDtInterval = setInterval(() => {
            const [serverTime, serverDay] = getSrvDt();
            srvDtDiv.textContent = `Server Time: ${serverTime}, ${serverDay}`;

            const [userTime, userDay] = getUserDt();
            userDtDiv.textContent = `User Time: ${userTime}, ${userDay}`;
        }, 1000);
    }
}

fetch('events.json')
    .then(response => response.json())
    .then(events => {
        // Get the #events-container div
        const eventsContainer = document.getElementById('events-container');

        // Define the order of the days of the week
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // For each event...
        for (const eventName in events) {
            // Create a new div for the event container
            const eventContainer = document.createElement('div');
            eventContainer.className = 'event-container';

            // Create a new div for the event name
            const eventNameDiv = document.createElement('div');
            eventNameDiv.className = 'event-name';
            eventNameDiv.textContent = eventName;
            eventContainer.appendChild(eventNameDiv);

            const eventTimes = events[eventName];

            // For each day of the week...
            daysOfWeek.forEach(dayOfWeek => {
                const times = eventTimes[dayOfWeek];

                // If there are times for this day...
                if (times) {
                    // Sort the times
                    times.sort();

                    // Create a new div for the day-times container
                    const dayTimesContainer = document.createElement('div');
                    dayTimesContainer.className = 'day-times-container';
                    eventContainer.appendChild(dayTimesContainer);

                    // Create a new div for the day of the week
                    const dayOfWeekDiv = document.createElement('div');
                    dayOfWeekDiv.className = 'day-of-week';
                    dayOfWeekDiv.textContent = `${dayOfWeek}`;
                    dayTimesContainer.appendChild(dayOfWeekDiv); // Append to dayTimesContainer

                    // Create a new div for the times
                    const timesContainer = document.createElement('div');
                    timesContainer.className = 'times-container';
                    times.forEach(time => {
                        const timeDiv = document.createElement('div');
                        timeDiv.className = 'time';
                        timeDiv.textContent = time;
                        timesContainer.appendChild(timeDiv);
                    });
                    dayTimesContainer.appendChild(timesContainer); // Append to dayTimesContainer
                }
            });

            // Append the eventContainer to the eventsContainer
            eventsContainer.appendChild(eventContainer);
        }
    });

// Switch to the "Main" tab by default
switchTab('main');