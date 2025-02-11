const SERVERFILE = "../assets/jsons/sro_sailor_pe.json";
//const SERVERFILE = "../assets/jsons/7s-events.json";

let serverConfig;
let serverTimezone;
let serverName;
let serverDelay;
let serverEvents;

const blacklistAll = [""];

async function initializeServerConfig() {
    const response = await fetch(SERVERFILE);
    serverConfig = await response.json();
    serverTimezone = serverConfig.serverTimezone;
    serverName = serverConfig.serverName;
    serverDelay = serverConfig.serverDelay;
    serverEvents = Object.fromEntries(
        Object.entries(serverConfig.serverEvents).filter(
            ([eventName]) => !blacklistAll.includes(eventName)
        )
    );
}

export {
    initializeServerConfig,
    serverConfig,
    serverTimezone,
    serverName,
    serverDelay,
    serverEvents
};