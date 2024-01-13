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

    const downloadLink = document.createElement('a');
    downloadLink.href = 'downloads/sailor_events.rar';
    downloadLink.download = 'sailor_events.rar';
    downloadLink.textContent = 'Download';
    downloadLink.className = 'download-button';
    appDiv.appendChild(downloadLink);

    const changeLogDiv = document.createElement('div');
    changeLogDiv.className = 'change-log changelog';
    changeLogDiv.style.marginTop = '50px';
    changeLogDiv.style.marginLeft = '25%';
    changeLogDiv.innerHTML = `
        <h3 style="text-align: left;">Changelog</h3>
        <p style="text-align: left;">
            <h2>1.5 Version - Latest<br></h2>
            1. Better visiblity and event tracking!<br>
            <br>
            &emsp; Now only events that are checked will be tracked in the "Next Event" headline.<br>
            &emsp; Additionally, the "Next Event" headline will now show the next 2 events instead of just 1.<br>
            <br>
            2. Improvements to voice selection!<br>
            <br>
            &emsp; You can now choose voices that are available on your system, instead of switching between male/female (which was kinda buggy).<br>
            <br>
            3. No more updating for tooltip changes!<br>
            <br>
            &emsp; The app will now fetch the tooltips from the github repository, meaning on tooltip updates you only have to restart the app.<br>
            <br>
            5. Donations!<br>
            <br>
            &emsp; Added a donation button, if you like the app and want to support me, you can now do so!<br>
            <br>
            4. GUI improvements!<br>
            <br>
            &emsp; Voice selection is a dropdown now, slider has been updated to a more modern look.<br>
            <br>
            <h2>1.4 Version - Outdated<br></h2>
            1. No more events.json!<br>
            <br>
            &emsp;All events are now stored in a public github repository and the app will fetch them from it.<br>
            &emsp;This means that you dont have to download the app again (or change events.json yourself) when the schedule changes.<br>
            &emsp;This also means that you can now contribute to the schedule by making a pull request on github!<br>
            <br>
            &emsp;https://raw.githubusercontent.com/0xEvolex/0xevolex.github.io/main/events.json<br>
            <br>
            2. No more config resets!<br>
            <br>
            &emsp;The config.txt file sometimes had to be deleted when there was a new version available, this is no longer the case.<br>
            &emsp;The app will now automatically update the config file if there are any changes.<br>
            <br>
            3. More tooltips!<br>
            <br>
            &emsp;Updated event tooltips for: Ghost hunt, Job Temple Uniques, Styria Clash, Special Trade, Fence Trade<br>
            <br>
            4. Schedule changes!<br>
            <br>
            &emsp;a. Styria Clash at 23:30 every Saturday was moved to 23:20 every Saturday permanently<br>
            &emsp;b. Job BA at Friday 23:45 was removed to make room for Guild BA<br>
            &emsp;c. Special Trade at Sunday 20:00 was removed to make room for Fortress War<br>
            <br>
            5. More features!<br>
            <br>
            &emsp;a. Added a changelog to the website.<br>
            &emsp;b. Added a volume slider for sound alerts. (Requested by @webdev7)<br>
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
        </p>
    `;
    appDiv.appendChild(changeLogDiv);
});