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
    let name = data.get('name');
    let teamNumber = data.get('team');
    let teamScouted = data.get('ts');
    let matchNumber = data.get('match');
    if (!name || !teamNumber || !teamScouted || !matchNumber) {
        alert('please make sure you have provided all information (top 4 fields)');
        return;
    }
    if (!confirm('Are you sure you want to submit?')) {
        return;
    }
    //adding fields that are empty by default
    ['no-show', 'auto-engage-attempt', 'tele-engage-attempt', 'pre-loaded', 'mobility', 'broke-down'].forEach((name) => {
        console.log(!data.get(name));
        if (!data.get(name)) {
            data.set(name, '0');
        }
    });
    fetch(scriptURL, {
        method: 'POST',
        body: data,
    }) /*TODO: handle response */;
    //clearing fields
    [...document.querySelectorAll('input')].forEach((input) => {
        let name = input.name;
        if (!['ScoutName', 'ScoutTeamNumber', 'TeamNumScouted', 'MatchNum'].includes(name)) {
            if (input.type == 'text' || input.type == 'number') {
                input.value = '';
            }
        }
    });
    setCookie();
}
form.addEventListener('submit', submit);

function setCookie(){
    let formData = new FormData(form);
    let name = formData.get("ScoutName");
    let team = formData.get("ScoutTeamNum");
    document.cookie = encodeURIComponent("name=" + name + ";team=" + team + ";expires=10000000000000000;path=/")
}

function displaySavedData(){
    let scoutName = document.querySelector("input[name=ScoutName]");
    let teamNum = document.querySelector("input[name=ScoutTeamNum]");
    let decodedCoookie = decodeURIComponent(document.cookie);
    for(element of decodedCoookie.split(';')){
        let [name, value] = element.split("=")
        if(name == "name"){
            scoutName.value = value;
        }
        else if(name == "team"){
            teamNum.value = value;
        }
    }
}

displaySavedData();