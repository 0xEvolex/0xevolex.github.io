// main.js

document.addEventListener('DOMContentLoaded', function () {
    // Fetch events data from events.json
    fetch('/events.json')
      .then(response => response.json())
      .then(eventsData => {
        // Call the function to display remaining time
        displayRemainingTime(eventsData);
      })
      .catch(error => console.error('Error fetching events data:', error));
  
    // Function to calculate and display remaining time
    function displayRemainingTime(eventsData) {
      // Get the current date and time
      const currentDate = new Date();
  
      // Loop through each event type
      Object.keys(eventsData).forEach(eventType => {
        // Loop through each day for the event type
        Object.keys(eventsData[eventType]).forEach(day => {
          // Loop through each event time for the day
          eventsData[eventType][day].forEach(eventTime => {
            // Parse event time string to create a Date object
            const [hours, minutes] = eventTime.split(':');
            const eventDate = new Date(currentDate);
            eventDate.setHours(parseInt(hours, 10));
            eventDate.setMinutes(parseInt(minutes, 10));
            eventDate.setSeconds(0);
  
            // Check if the event time is in the future
            if (eventDate > currentDate) {
              // Calculate remaining time
              const remainingTime = eventDate - currentDate;
  
              // Display remaining time (you can adjust this based on your needs)
              const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
              const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  
              // Display the remaining time in the console (you can update this to display on your webpage)
              console.log(`Next ${eventType} on ${day} at ${eventTime}: ${remainingHours} hours and ${remainingMinutes} minutes remaining.`);
            }
          });
        });
      });
    }
  });
  