document.addEventListener("DOMContentLoaded", function () {
    // Fetch events data
    fetch('events.json')
        .then(response => response.json())
        .then(data => displayRemainingTimes(data))
        .catch(error => console.error('Error fetching events data:', error));

    // Function to display remaining times
    function displayRemainingTimes(eventsData) {
        // Your logic for calculating remaining times goes here
        // Use eventsData to access the events schedule

        // Example: Display a message in the "remainingTimes" div
        const remainingTimesDiv = document.getElementById('remainingTimes');
        remainingTimesDiv.innerHTML = 'Remaining times will be displayed here.';
    }
});
