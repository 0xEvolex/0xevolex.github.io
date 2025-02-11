const TRANSLATIONFILE = "../assets/jsons/translations.json";
let translations = {};
let currentLanguage = localStorage.getItem('language') || 'en';

document.addEventListener('DOMContentLoaded', () => {
    fetch(TRANSLATIONFILE)
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyTranslations();
        });

    document.getElementById('language-dropdown').addEventListener('click', (event) => {
        if (event.target && event.target.matches('.language-option')) {
            setLanguage(event.target.dataset.language);
        }
    });

    populateLanguageDropdown();
});

function setLanguage(language) {
    localStorage.setItem('language', language);
    location.reload();
}

function applyTranslations() {
    const mapping = {
        ".talking-head": { title: "talking-Head_title" },
        'a[href="https://discord.com/invite/zMNUVVF3Gx"]': { title: "socials_discord_title" },
        'a[href="https://twitter.com/Evolexwastaken"]': { title: "socials_twitter_title" },
        'a[href="https://github.com/0xEvolex/"]': { title: "socials_github_title" },
        'a[href="https://ko-fi.com/evolex"]': { title: "socials_kofi_title" },
        ".language-menu": { title: "language-menu_title" },
        "#btn-language": { title: "btn-language_title" },
        ".blacklist-menu": { title: "blacklist-menu_title" },
        "#btn-blacklist": { title: "btn-blacklist_title" },
        ".announcer-menu": { title: "announcer-menu_title" },
        "#btn-announcer": { title: "btn-announcer_title" },
        ".pre-alert-menu": { title: "pre-alert-menu_title" },
        "#btn-pre-alert": { title: "btn-pre-alert_title" },
        "#pre-alert-value": { textContent: "pre-alert-value_textContent" },
        ".volume-slider-container": { title: "volume-slider-container_title" },
        "#btn-volume": { title: "btn-volume_title" },
        "#disclaimer": { textContent: "disclaimer_textContent" },
        ".fortress-war-title": { textContent: "fortress-war-title_textContent" },
        ".genie-reset-title": { textContent: "genie-reset-title_textContent" },
        ".calendar-reset-title": { textContent: "calendar-reset-title_textContent" },
        "#user-time": { title: "user-time_title" },
        ".footer-container.center": { title: "footer-container-center_title", textContent: "fan_made_project" },
        "#server-time": { title: "server-time_title" },
        "#btn-introduction": { title: "btn-introduction_title" },
        "#introduction-modal h2": { textContent: "introduction_modal_title" },
        "#introduction-modal p": { textContent: "introduction_modal_content" },
        "#introduction-mute-description": { textContent: "introduction_mute_description" },
        "#introduction-pre-alert-description": { textContent: "introduction_pre_register_description" },
        "#introduction-voice-selector-description": { textContent: "introduction_voice_selector_description" },
        "#introduction-blacklist-description": { textContent: "introduction_blacklist_description" },
        "#introduction-language-description": { textContent: "introduction_language_description" },
        "#introduction-event-name-description": { textContent: "introduction_event_name_description" },
        "#introduction-remaining-time-description": { textContent: "introduction_remaining_time_description" },
        "#introduction-register-method-description": { textContent: "introduction_register_method_description" },
        "#introduction-next-event-date-description": { textContent: "introduction_next_event_date_description" },
        "#introduction-sound-description": { textContent: "introduction_sound_description" }
    };

    for (let [selector, attributes] of Object.entries(mapping)) {
        let element = document.querySelector(selector);
        if (!element) {
            console.error(`Element not found for selector: ${selector}`);
            continue;
        }
        for (let [attr, key] of Object.entries(attributes)) {
            if (translations[key] && translations[key][currentLanguage]) {
                element[attr] = translations[key][currentLanguage];
            } else {
                console.warn(`Couldn't find translation for ${key} in ${currentLanguage}`);
            }
        }
    }
}

function populateLanguageDropdown() {
    const languageDropdown = document.getElementById('language-dropdown');
    const supportedLanguages = [
        { code: 'en', name: 'English', flag: 'https://flagcdn.com/gb.svg' },
        { code: 'tr', name: 'Türkçe', flag: 'https://flagcdn.com/tr.svg' },
        { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/de.svg' },
        { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/eg.svg' }
    ];

    supportedLanguages.forEach(lang => {
        const option = document.createElement('div');
        option.classList.add('language-option');
        if (lang.code !== 'en') {
            option.classList.add('disabled');
        }
        option.dataset.language = lang.code;
        option.innerHTML = `<img src="${lang.flag}" alt="${lang.name} flag" class="flag-icon"> ${lang.name}`;
        languageDropdown.appendChild(option);
    });
}