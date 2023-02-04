const scriptURL = 'https://script.google.com/a/macros/francisparker.org/s/AKfycbzqU1pFT8xs-EY1GeMHsYQEQaTnRBeIDDVYX29y0uGQghlLQEEEYXzZs_h4w0im0efL/exec';
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
    let value = e.getAttribute('value');
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
    [
        { time: 'tele', cap: 'Tele' },
        { time: 'end', cap: 'End' },
    ].forEach(({ time, cap }) => {
        let chargeInfo = data.get(time + '-charge'); //has value: none, attempted, docked, engaged
        let engagedAttempt = data.get(time + '-engage-attempt');
        //calculating values
        let dockAttempt = chargeInfo == 'attempted';
        let dockSuccess = chargeInfo == 'docked';
        let engagedSuccess = chargeInfo == 'engaged';
        if (engagedSuccess) {
            engagedAttempt = true;
        }
        //setting new values
        data.set(time + '-charge', null);
        data.set(time + '-engage-attempt', null);
        data.set(cap + 'DockAttempt', dockAttempt || dockSuccess || engagedSuccess ? 1 : 0);
        data.set(cap + 'DockSuccess', dockSuccess || engagedSuccess ? 1 : 0);
        data.set(cap + 'EngagedAttempt', engagedAttempt || engagedSuccess ? 1 : 0);
        data.set(cap + 'EngagedSuccess', engagedSuccess ? 1 : 0);
    });
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
    // test
    //clearing fields
    [...document.querySelectorAll('input')].forEach((input) => {
        let name = input.name;
        if (!['ScoutName', 'ScoutTeamNum', 'TeamNumScouted', 'MatchNum'].includes(name)) {
            if (input.type == 'text') {
                input.value = '';
            }
            if (input.type == 'number') {
                input.value = 0;
            }
        }
    });
}
form.addEventListener('submit', submit);

//check-super-box code
[...document.querySelectorAll('.check-super-box')].forEach((csb) =>
    csb.addEventListener('click', (e) => {
        let input = csb.querySelector('input');
        input.checked = !input.checked;
        csb.className = input.checked ? 'check-super-box checked' : 'check-super-box';
    })
);
//radio-super-box
document.querySelectorAll('.radio-super-box').forEach((radioSuperBoxes) => {
    let radioButtonBoxes = radioSuperBoxes.children;
    [...radioButtonBoxes].forEach((button) =>
        button.addEventListener('click', (e) => {
            let input = button.querySelector('input');
            input.checked = true;
            [...radioButtonBoxes].forEach((b) => (b.className = ''));
            input.parentElement.className = 'checked';
        })
    );
});
