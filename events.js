(function() {
    function fetchAndRenderEvents() {
        fetch('data/events.json')
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

                    // Rest of your code...
                }
            });
    }

    // Expose the function to the global scope
    window.fetchAndRenderEvents = fetchAndRenderEvents;
})();