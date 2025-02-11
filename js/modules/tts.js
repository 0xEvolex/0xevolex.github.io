import { currentVolume, isMuted } from './audio.js';
import { logInfo, logWarn } from './logger.js';

const DEFAULT_VOICE_NAME = "Microsoft Mark - English (United States)";
const BLACKLISTED_VOICES = [];
let voices = [];

export function populateVoices() {
    voices = speechSynthesis.getVoices();
    const voiceDropdown = document.getElementById('announcer-dropdown');
    if (!voiceDropdown) return;

    const filteredVoices = voices.filter(voice => !BLACKLISTED_VOICES.includes(voice.name));
    voiceDropdown.innerHTML = filteredVoices.map(voice => `<option class="announcer-option" value="${voice.name}">${voice.name}</option>`).join('');
}

export function textToSpeech(text, volume = currentVolume) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = isMuted ? 0 : volume;

    const selectedVoiceName = localStorage.getItem('selectedVoice') || DEFAULT_VOICE_NAME;
    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        logWarn(`Voice "${selectedVoiceName}" not found. Using default voice.`);
    }

    speechSynthesis.speak(utterance);
}

document.addEventListener("DOMContentLoaded", () => {
    speechSynthesis.onvoiceschanged = populateVoices;
    populateVoices();

    document.getElementById('announcer-dropdown').addEventListener('click', (event) => {
        const selectedVoice = event.target.value;
        localStorage.setItem('selectedVoice', selectedVoice);
        logInfo(`Selected voice: ${selectedVoice}`);
    });

    const savedVoice = localStorage.getItem('selectedVoice');
    if (savedVoice) {
        document.getElementById('announcer-dropdown').value = savedVoice;
    }
});

export function announceEventStart(eventName) {
    const message = `Event: ${eventName} has started.`;
    textToSpeech(message);
    logInfo(`TTS: ${message}`);
}

export function announceEventReminder(eventName, minutes) {
    const isReminded = localStorage.getItem(`remind-${eventName}`) === 'true';
    if (isReminded && !isMuted) {
        let message;
        if (minutes === 1) {
            message = `Event: ${eventName} will start in ${minutes} minute.`;
        } else {
            message = `Event: ${eventName} will start in ${minutes} minutes.`;
        }
        textToSpeech(message);
        logInfo(`TTS: ${message}`);
    } else {
        logInfo(`Skipping reminder for event "${eventName}" because sound is disabled.`);
    }
}