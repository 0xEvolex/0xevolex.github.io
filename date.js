(function() {
    function getSrvDt() {
        const date = new Date();

        const serverTime = new Intl.DateTimeFormat('en-US', { 
            timeZone: 'Europe/Helsinki',
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        }).format(date);

        const serverDay = new Intl.DateTimeFormat('en-US', { 
            timeZone: 'Europe/Helsinki',
            weekday: 'short' 
        }).format(date);

        return [serverTime, serverDay];
    }

    function getUserDt() {
        const date = new Date();

        const userTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);

        const userDay = new Intl.DateTimeFormat('en-US', {
            weekday: 'short'
        }).format(date);

        return [userTime, userDay];
    }

    // Expose the functions to the global scope
    window.getSrvDt = getSrvDt;
    window.getUserDt = getUserDt;
})();