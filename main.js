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
    imageContainer.appendChild(img1);  // append to imageContainer

    const img2 = document.createElement('img');
    img2.src = 'images/app_tab_settings.png';
    img2.style.borderRadius = '10px';
    img2.style.margin = '10px';
    imageContainer.appendChild(img2);  // append to imageContainer

    // Add the download link as a button
    const downloadLink = document.createElement('a');
    downloadLink.href = 'downloads/sailor_events.rar';
    downloadLink.download = 'sailor_events.rar';
    downloadLink.textContent = 'Download';
    downloadLink.className = 'download-button';
    appDiv.appendChild(downloadLink);
});