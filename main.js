const scriptURL = 'https://script.google.com/a/macros/francisparker.org/s/AKfycbwlk1qG0TwOUQURlfrhIBBNyEcFfOtaThkh_1oEdZd_RoWk5CHagvy35AZNXwT4emzH/exec';

/**
 * Handling the onclick for adding to the game piece count
 */
function addGamePiece(e, index) {
    let row = e.parentElement.parentElement;
    let input = row.querySelectorAll('input')[index];
    let v = input.value * 1; // times 1 so it copies the number, and not a reference
    input.value = Math.min(input.max, v + 1);
}

/**
 * Handling the onclick for subtracting to the game piece count
 */
function subtractGamePiece(e, index) {
    let row = e.parentElement.parentElement;
    let input = row.querySelectorAll('input')[index];
    let v = input.value * 1; // times 1 so it copies the number, and not a reference
    input.value = Math.max(input.min, v - 1);
}

/**
 * Handles the onclick for setting the hidden input for the qualitative value
 */
function setQualitative(e) {
    let q_row = e.parentElement;
    let input = q_row.querySelector('input');
    let value = e.value;
    input.value = value;
    //TODO: set styles?
}

const form = document.forms['scouting-form'];
function submit(e) {
    e.preventDefault();
    window.data = new FormData(form);
    //checking data
    let name = data.get('ScoutName');
    let teamNumber = data.get('ScoutTeamNum');
    let teamScouted = data.get('TeamNumScouted');
    let matchNumber = data.get('MatchNum');
    if (!name || !teamNumber || !teamScouted || !matchNumber) {
        alert('please make sure you have provided all information (top 4 fields)');
        return;
    }
    if (!confirm('Are you sure you want to submit?')) {
        return;
    }
    //TODO: set auto-charge and tele-charge to their sets of data
    //adding fields that are empty by default
    ['NoShow', 'AutoEngagedAttempt', 'EndEngagedAttempt', 'PreLoaded', 'Mobility', 'Breakdown'].forEach((name) => {
        console.log(!data.get(name));
        if (!data.get(name)) {
            data.set(name, '0');
        }
    });
    console.log([...data.entries()]);
    fetch(scriptURL, {
        method: 'POST',
        body: data,
    }) /*TODO: handle response */;
    //clearing fields
    [...document.querySelectorAll('input')].forEach((input) => {
        let name = input.name;
        if (!['ScoutName', 'ScoutTeamNum', 'TeamNumScouted', 'MatchNum'].includes(name)) {
            if (input.type == 'text' || input.type == 'number') {
                input.value = '';
            }
        }
    });
}
form.addEventListener('submit', submit);
