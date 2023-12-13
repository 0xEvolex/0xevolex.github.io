// Switch to a tab
function switchTab(tabId) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    // Show the selected tab content
    document.getElementById(tabId).style.display = 'block';
}

// Fetch the events data from events.json
fetch('events.json')
    .then(response => response.json())
    .then(events => {
        // Get the #events-container div
        const eventsContainer = document.getElementById('events-container');

        // For each event...
        for (const eventName in events) {
            const eventTimes = events[eventName];

            // For each day of the week...
            for (const dayOfWeek in eventTimes) {
                const times = eventTimes[dayOfWeek];

                // For each time...
                times.forEach(time => {
                    // Create a new div for the event
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'event';

                    // Create a new div for the event name
                    const eventNameDiv = document.createElement('div');
                    eventNameDiv.className = 'event-name';
                    eventNameDiv.textContent = `${eventName} - ${dayOfWeek} - ${time}`;
                    eventDiv.appendChild(eventNameDiv);

                    // Add the event div to the #events-container div
                    eventsContainer.appendChild(eventDiv);
                });
            }
        }
    });

// Switch to the "Main" tab by default
switchTab('main');