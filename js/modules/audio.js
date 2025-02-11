export let currentVolume = parseFloat(localStorage.getItem('volume')) || 1;
export let isMuted = localStorage.getItem('isMuted') === 'true';

export function initializeAudioControls() {
    const muteButton = document.getElementById('btn-volume');
    const muteIcon = document.getElementById('ic-volume');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    const activateSound = document.getElementById('activate-sound');
    const audioElements = document.querySelectorAll('audio, video');
    
    let previousVolume = parseFloat(localStorage.getItem('previousVolume')) || currentVolume;

    updateMuteState();

    volumeSlider.addEventListener('input', (event) => {
        volumeValue.textContent = `Volume: ${Math.round(event.target.value * 100)}%`;
        volumeValue.style.display = 'inline';
    });

    volumeSlider.addEventListener('change', (event) => {
        currentVolume = parseFloat(event.target.value);
        localStorage.setItem('volume', currentVolume);
        if (!isMuted) {
            audioElements.forEach(el => el.volume = currentVolume);
            activateSound.volume = currentVolume;
            activateSound.play();
        }
    });

    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        localStorage.setItem('isMuted', isMuted);
        if (isMuted) {
            previousVolume = currentVolume;
            localStorage.setItem('previousVolume', previousVolume);
        } else {
            currentVolume = previousVolume;
            volumeSlider.value = currentVolume;
            activateSound.volume = currentVolume;
            activateSound.play();
        }
        updateMuteState();
    });

    function updateMuteState() {
        if (isMuted) {
            muteButton.classList.add('muted');
            muteIcon.classList.remove('fa-bell');
            muteIcon.classList.add('fa-bell-slash');
            muteIcon.style.color = 'red';
            volumeSlider.disabled = true;
            volumeSlider.classList.add('disabled');
            audioElements.forEach(el => el.muted = true);
            volumeValue.textContent = `Volume: ${Math.round(previousVolume * 100)}%`;
        } else {
            muteButton.classList.remove('muted');
            muteIcon.classList.remove('fa-bell-slash');
            muteIcon.classList.add('fa-bell');
            muteIcon.style.color = 'green';
            volumeSlider.disabled = false;
            volumeSlider.classList.remove('disabled');
            audioElements.forEach(el => el.muted = false);
            audioElements.forEach(el => el.volume = currentVolume);
            volumeSlider.value = currentVolume;
            volumeValue.textContent = `Volume: ${Math.round(currentVolume * 100)}%`;
        }
    }
}