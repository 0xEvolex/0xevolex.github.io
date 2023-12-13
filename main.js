document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from events.json
    fetch('https://raw.githubusercontent.com/0xEvolex/0xevolex.github.io/main/events.json')
        .then(response => response.json())
        .then(data => {
            // Process the data and update the DOM
            updateEventCountdown(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to update the DOM with event countdown
    function updateEventCountdown(eventsData) {
        // Use the data to calculate remaining times and update the DOM
        // Add your logic here to manipulate the content of the #eventCountdown div
        // For example, you can create new elements, update text content, etc.
        const eventCountdownDiv = document.getElementById('eventCountdown');
        
        // Example: Display event names
        const eventNames = Object.keys(eventsData);
        const eventNamesList = document.createElement('ul');
        eventNames.forEach(eventName => {
            const listItem = document.createElement('li');
            listItem.textContent = eventName;
            eventNamesList.appendChild(listItem);
        });

        // Append the event names list to the eventCountdownDiv
        eventCountdownDiv.appendChild(eventNamesList);
    }
});
