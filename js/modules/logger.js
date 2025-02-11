const levels = {
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR'
};

function log(level, message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]-[${levels[level]}]: ${message}`);
}

export function logInfo(message) {
    log('info', message);
}

export function logWarn(message) {
    log('warn', message);
}

export function logError(message) {
    log('error', message);
}