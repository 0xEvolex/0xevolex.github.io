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
            <h2>1.4 Version - Latest<br></h2>
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
            <h2>Coming soon / to be evaluated<br></h2>
            1. Request from #imafkinpotato: Option for minimizing to system tray instead of task bar<br>
            2. Request from #luminescencex: Only show events on the headline that you checked (+ dont log unchecked events)<br>
            3. Request #webdev7: Ring sounds instead of voice sounds<br>
            4. Show 2 next events on the headline instead of just 1 (Next Event: Ghost Hunt in 07:13 -> BA Random in 47:13)<br>
            5. Indicate which events are running right now, it should display RUNNING on the timer label<br>
            6. Request from (sorry I forgot): Option to disable lock out when theres a new version available<br>
            7. Dark mode and or other themes<br>
            8. More voice styles for sound alerts<br>
            9. Auto update / download new version<br>
            10. Autostart on boot<br>
            11. Move away from tkinter and use a better GUI framework
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