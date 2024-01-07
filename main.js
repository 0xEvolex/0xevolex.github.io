document.addEventListener('DOMContentLoaded', (event) => {
    const appDiv = document.getElementById('app');

    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.textContent = 'An app that will display you all Sailor Events and allow you to set sound alarms for them!';
    disclaimerDiv.style.textAlign = 'center';
    disclaimerDiv.className = 'schedule-disclaimer';
    appDiv.appendChild(disclaimerDiv);

    const imageContainer = document.createElement('div');
    imageContainer.style.display = 'flex';
    imageContainer.style.justifyContent = 'center';
    appDiv.appendChild(imageContainer);

    const img1 = document.createElement('img');
    img1.src = 'images/app_tab_events.png';
    img1.style.borderRadius = '10px';
    img1.style.margin = '10px';
    imageContainer.appendChild(img1);

    const img2 = document.createElement('img');
    img2.src = 'images/app_tab_settings.png';
    img2.style.borderRadius = '10px';
    img2.style.margin = '10px';
    imageContainer.appendChild(img2);

    // Add the download link as a button
    const downloadLink = document.createElement('a');
    downloadLink.href = 'downloads/sailor_events.rar';
    downloadLink.download = 'sailor_events.rar';
    downloadLink.textContent = 'Download';
    downloadLink.className = 'download-button';
    appDiv.appendChild(downloadLink);

    // Add another div for change logs
    const changeLogDiv = document.createElement('div');
    changeLogDiv.className = 'change-log changelog';
    changeLogDiv.style.marginTop = '50px';
    changeLogDiv.style.marginLeft = '25%';
    changeLogDiv.innerHTML = `
        <h3 style="text-align: left;">Change Log</h3>
        <p style="text-align: left;">
            <h2>1.4 Version - Latest<br></h2>
            1. Styria Clash at 23:30 every Saturday was moved to 23:20 every Saturday permanently<br>
            2. Job BA at Friday 23:45 was removed to make room for Guild BA<br>
            3. Special Trade at Sunday 20:00 was removed to make room for Fortress War<br>
            4. Tooltip updates: Ghost hunt, Job Temple Uniques, Styria Clash<br>
            5. Request from #webdev7: Added volume slider for sound alerts<br>
            6. Linting and refactoring to improve code quality<br>
            7. Improved config manager so config doesnt have to be reset with every update (you dont have to replace config.txt anymore)<br>
            8. Outsourced the schedule to github so it doesnt have to be updated manually or be saved locally (events.json no longer needed, delete it)<br>
            9. Added a changelog to the website, website code cleanup<br>
            <h2>1.3 Version - Outdated<br></h2>
            1. A few bug fixes when transitioning to another day, happened with big timezone differences<br>
            2. Added fortress war timer<br>
            3. Updated tooltips
            <h2>1.2 Version - Outdated<br></h2>
            1. Added sound queueing so that sounds dont overlap, added some more multi threading to avoid alerts from being skipped<br>
            2. Added an update checker that will lock out the app if theres a new version available<br>
            2. Bunch of bug fixes<br>
            3. Usability improvements<br>
            <h2>1.1 Version - Outdated<br></h2>
            1. Added free thursday<br>
            2. Bunch of bug fixes<br>
            3. Usability improvements<br>
            <h2>1.0 Version - Outdated<br></h2>
            1. Initial release right after grace period<br>

            Coming soon / to be evaluated<br>
            <br>
            1. Request from #imafkinpotato: Option for minimizing to system tray instead of task bar<br>
            2. Request from #luminescencex: Only show events on the headline that you checked (+ dont log unchecked events)<br>
            3. Request #webdev7: Ring sounds instead of voice sounds<br>
            4. Show 2 next events on the headline instead of just 1 (Next Event: Ghost Hunt in 07:13 -> BA Random in 47:13)<br>
            5. Indicate which events are running right now, it should display RUNNING on timer label<br>
            6. Request from (sorry I forgot): Option to disable lock out when theres a new version available<br>
            <br>
        </p>
    `;
    appDiv.appendChild(changeLogDiv);
});