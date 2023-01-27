/**
 * Handling the onclick for adding to the game piece count
 */
function addGamePiece(e) {
    let row = e.parentElement.parentElement;
    let input = row.querySelector('input');
    let v = input.value * 1; // times 1 so it copies the number, and not a reference
    input.value = Math.min(input.max, v + 1);
}

/**
 * Handling the onclick for subtracting to the game piece count
 */
function subtractGamePiece(e) {
    let row = e.parentElement.parentElement;
    let input = row.querySelector('input');
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
    //TODO: reset fields (increase match number)
    //TODO: finish submit
}
form.addEventListener('submit', submit);