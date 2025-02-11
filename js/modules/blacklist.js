import { serverEvents } from './server.js';
import { populateEventTables } from './table.js';
import { initializePreRegisterButton, clearScheduledReminders } from './scheduler.js';

const EXCLUDED_EVENTS = ["Fortress War", "Genie Reset", "Calendar Reset"];

export function initializeBlacklist() {
    const blacklistButton = document.getElementById('btn-blacklist');
    const blacklistDropdown = document.getElementById('blacklist-dropdown');

    blacklistButton.addEventListener('click', () => {
        const container = document.querySelector('.blacklist-menu');
        container.classList.toggle('active');

        const voiceContainer = document.querySelector('.voice-selector-container');
        if (voiceContainer.classList.contains('active')) {
            voiceContainer.classList.remove('active');
        }
    });

    populateBlacklistDropdown();
}

function populateBlacklistDropdown() {
    const blacklistDropdown = document.getElementById('blacklist-dropdown');
    blacklistDropdown.innerHTML = '';

    const events = Object.keys(serverEvents).filter(eventName => !EXCLUDED_EVENTS.includes(eventName));

    for (const eventName of events) {
        const isBlacklisted = localStorage.getItem(`blacklist-${eventName}`) === 'true';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !isBlacklisted;
        checkbox.id = `blacklist-${eventName}`;
        checkbox.addEventListener('change', () => toggleBlacklist(eventName, checkbox.checked));

        const label = document.createElement('label');
        label.htmlFor = `blacklist-${eventName}`;
        label.textContent = eventName;

        const div = document.createElement('div');
        div.classList.add('blacklist-option');
        div.appendChild(checkbox);
        div.appendChild(label);

        blacklistDropdown.appendChild(div);
    }
}

function toggleBlacklist(eventName, isVisible) {
    localStorage.setItem(`blacklist-${eventName}`, !isVisible);
    populateEventTables();

    if (isVisible) {
        initializePreRegisterButton(eventName);
    } else {
        clearScheduledReminders(eventName);
    }
}