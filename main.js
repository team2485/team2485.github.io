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
    let data = new FormData(form);
    console.log([...data.entries()]);
    //TODO: make sure data is good
    //TODO: confirm they want to submit
    //TODO: add data for checkboxes and other fields that don't typically exist

    //TODO: finish submit
}
form.addEventListener('submit', submit);