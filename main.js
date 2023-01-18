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
