const scriptURL = 'https://script.google.com/macros/s/AKfycbyr8woNmi1zLBQkzC52Wl92rTT9RO5lxsAIYQxcXJ30ITt6JRKr-tdKwZXwe-524v6i/exec';
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
 * Updates the charge station to display the correct checkboxes
 */
function updateChargeStationCheckboxes() {
    //* Getting Data
    let data = new FormData(document.forms['scouting-form']);

    //* Auto
    let autoChargeStationState = data.get('auto-charge');
    let autoEngagedAttempt = document.querySelector('#engage-attempt-auto');
    //reset values
    if (autoChargeStationState !== 'docked') {
        //only resets if docked is not the one clicked
        let autoEngagedAttemptCheckbox = document.querySelector('#auto-engage-attempt');
        autoEngagedAttemptCheckbox.checked = false;
        autoEngagedAttemptCheckbox.parentElement.classList.remove('checked'); //makes not green
    }
    //hide/unhide
    autoEngagedAttempt.style = autoChargeStationState == 'docked' ? '' : 'display: none;';

    //* End
    let endChargeStationState = data.get('end-charge');
    let endEngagedAttempt = document.querySelector('#end-engage');
    let endPark = document.querySelector('#end-park');
    //reset values
    if (endChargeStationState !== 'docked') {
        //only resets if docked is not the one clicked
        let endEngagedAttemptCheckbox = document.querySelector('#end-engage-attempt');
        endEngagedAttemptCheckbox.checked = false;
        endEngagedAttemptCheckbox.parentElement.classList.remove('checked'); //makes not green
    }
	if (endChargeStationState !== 'none') {
        //only resets if none is not the one clicked
        let parkedCheckbox = document.querySelector('#Parked');
        parkedCheckbox.checked = false;
        parkedCheckbox.parentElement.classList.remove('checked'); //makes not green
    }
    autoEngagedAttempt.style = autoChargeStationState == 'docked' ? '' : 'display: none;';
    //hide/unhide
    autoEngagedAttempt.style = autoChargeStationState == 'docked' ? '' : 'display: none;';
    endEngagedAttempt.style = endChargeStationState == 'docked' ? '' : 'display: none;';
    endPark.style = endChargeStationState == 'none' ? '' : 'display: none;';
}

//back to top
let backToTop = document.querySelector('#back-to-top');
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
});

/**
 * Handles the onclick for setting the hidden input for the qualitative value
 */
function setQualitative(e) {
    let q_row = e.parentElement;
    let input = q_row.querySelector('input');
    let value = e.getAttribute('value');
    input.value = value;
    //styling
    let before = true;
    [...q_row.querySelectorAll('div')].forEach((input) => {
        input.className = 'star';
        if (e.value == -1) return;
        if (before) {
            input.className = 'star starred';
        }
        if (input == e) {
            before = false;
        }
    });
}

let breakdownCheckbox = document.querySelector('input[name=Breakdown]');
breakdownCheckbox.addEventListener('change', (e) => {
    let breakdownElab = document.querySelector('#breakdownCommentBox');
    let breakdownBox = document.querySelector('textarea[name=BreakdownCom]');
    if (breakdownCheckbox.checked == true) {
        let newValue = localStorage.getItem('breakdown');
        breakdownBox.value = newValue;
        breakdownElab.style = '';
    } else {
        breakdownElab.style = 'display:none';
        localStorage.setItem('breakdown', breakdownBox.value);
        breakdownBox.value = '';
    }
});

/**
 * Function to delete inputs upon submission and no show toggle
 */
function clearInputs() {
    [...document.querySelectorAll('input')].forEach((input) => {
        let name = input.name;
        if (!['ScoutName', 'ScoutTeamNum', 'TeamNumScouted', 'MatchNum', 'NoShow'].includes(name)) {
            if (input.type == 'text') {
                input.value = '';
            } else if (input.type == 'number') {
                input.value = 0;
            } else if (input.type == 'checkbox') {
                input.checked = false;
            } else if (input.type == 'hidden') {
                input.value = -1;
            }
        }
    });
    //removing stars and radio buttons
    [...document.querySelectorAll('.starred')].forEach((starredButton) => {
        starredButton.classList.remove('starred');
    });
    let checkedRadioAuto = document.querySelector('#auto-charge-none');
    let checkedRadioEndgame = document.querySelector('#end-charge-none');
    checkedRadioAuto.checked = true;
    checkedRadioEndgame.checked = true;

    //removing text boxes
    let breakdownElab = document.querySelector('[name=BreakdownCom]');
    let generalComments = document.querySelector('[name=GeneralCom]');
    let defenseCom = document.querySelector('[name=DefenseCom]');
    breakdownElab.value = '';
    generalComments.value = '';
    defenseCom.value = '';
    //hiding breakdown box
    let breakdownSection = document.querySelector('#breakdownCommentBox');
    breakdownSection.style = 'display: none;';
}

/**
 * Used for the NoShow input
 * Clears form elements if NoShow clicked
 */
function noShowToggleHandler(e){
    let input = document.querySelector('div.not-no-show');
    let inputCheckbox = document.querySelector('input[name=NoShow]');
    if(inputCheckbox.checked == true){
        input.style = "display:none";
        //saves the data needed
        let info = {};
        [...document.querySelectorAll('input')].forEach(input =>{
            if(input.name != "NoShow"){
                if(input.type == "checkbox"){
                    info[input.name] = input.checked;
                }
                else if(input.type == "radio"){
                    if(input.checked == true){
                        info[input.name] = input.value;
                    }
                }
                else{
                    info[input.name] = input.value;
                }
            }
        });

        [...document.querySelectorAll('textarea')].forEach(input =>{
            info[input.name] = input.value;
            console.count("textarea");
        });
        
        let finalizedInfo = JSON.stringify(info);
        localStorage.setItem("inGameData", finalizedInfo);
        clearInputs();
    }
    else{
        input.style = "";
        //displays saved data
        let dataInfo = localStorage.getItem("inGameData");
        let finalizedDataInfo = JSON.parse(dataInfo);
        
        for(let name in finalizedDataInfo){
            let queryString = "input[name=" + name + "],textarea[name=" + name + "]";
            let dataValue = document.querySelector(queryString);
            if(dataValue.type == "checkbox"){
                dataValue.checked = finalizedDataInfo[name];
            }
            else if(dataValue.type == "radio"){
                let checkedRadioButton = document.querySelector("[value=" + finalizedDataInfo[name] + "][name=" + name + "]");
                checkedRadioButton.checked = true;
            }
            else{
                dataValue.value = finalizedDataInfo[name];
            }
        }

        //adds classes to starred elements
        [...document.querySelectorAll(".qual")].forEach(element =>{
            let input = element.querySelector('input');
            let checkedStar = element.querySelector('button[value="' + input.value + '"],div[value="' + input.value + '"]');
            setQualitative(checkedStar);
        })
    }
}

let noShow = document.querySelector('input[name=NoShow]');
noShow.addEventListener('change', noShowToggleHandler);

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
        showAlert('Please make sure you have provided all information (top 4 fields)');
        window.scrollTo({
            top: 0, 
            left: 0,
            behavior: 'smooth',
        });
        return;
    }
    showConfirm(
        'Are you sure you want to submit?',
        () => {
            //Hit yes
            let submitButton = document.querySelector('#submit');
            submitButton.disabled = true;
            [
                { time: 'auto', cap: 'Auto' },
                { time: 'end', cap: 'End' },
            ].forEach(({ time, cap }) => {
                let chargeInfo = data.get(time + '-charge'); //has value: none, attempted, docked, engaged
                let engagedAttempt = data.get(time + '-engage-attempt');
                //calculating values
                let engagedSuccess = chargeInfo == 'engaged';
                engagedAttempt = engagedSuccess || engagedAttempt;
                let dockSuccess = engagedAttempt || chargeInfo == 'docked';
                let dockAttempt = dockSuccess || chargeInfo == 'attempted';
                //setting new values
                data.set(time + '-charge', null);
                data.set(time + '-engage-attempt', null);
                data.set(cap + 'DockedAttempt', dockAttempt ? 1 : 0);
                data.set(cap + 'DockedSuccess', dockSuccess ? 1 : 0);
                data.set(cap + 'EngagedAttempt', engagedAttempt ? 1 : 0);
                data.set(cap + 'EngagedSuccess', engagedSuccess ? 1 : 0);
            });
            //adding fields that are empty by default
            ['NoShow', 'AutoEngagedAttempt', 'EndEngagedAttempt', 'PreLoaded', 'Mobility', 'Breakdown', 'Parked'].forEach((name) => {
                console.log(!data.get(name));
                if (!data.get(name)) {
                    data.set(name, '0');
                }
            });
            console.log([...data.entries()]);
            fetch(scriptURL, {
                method: 'POST',
                body: data,
            })
                .then((response) => {
                    console.log(response);
                    if (response.status !== 200) {
                        showAlert('There was a problem submitting... please try again.');
                        return;
                    }
                    showAlert('Thank you!');
                    //resets the form
                    submitButton.disabled = false;
                    window.scrollTo({
                        top: 0, 
                        left: 0,
                        behavior: 'smooth',
                    });
                    clearInputs();
                    //removes excess
                    let noShow = document.querySelector('input[name=NoShow]');
                    noShow.checked = false;
                    localStorage.removeItem("inGameData");
                    localStorage.removeItem("breakdown");
                    noShowToggleHandler();
                    let teamNumScouted = document.querySelector('input[name=TeamNumScouted]');
                    teamNumScouted.value = '';
                    let matchNum = document.querySelector('input[name=MatchNum]');
                    matchNum.value++;
                    setLocalStorage();
                    document.querySelectorAll('.check-super-box').forEach(csb =>{
                        csb.classList.remove('checked');
                    });
                    let checkedRadioAuto = document.querySelector('#auto-charge-none');
                    let checkedRadioEndgame = document.querySelector('#end-charge-none');
                    checkedRadioAuto.click();
                    checkedRadioEndgame.click();

                    //confetti
                    document.querySelector('.confetti').classList.add('go');
                    setTimeout(() => {
                        document.querySelector('.go').classList.remove('go');
                    }, 3000);
                })
                .catch((error) => {
                    console.log(error);
                    showAlert('There was a problem... please try again and notify the Team 2485 Analytics department if this happens again.');
                });
            setCookie();
        },
        () => {
            /* Hit no */
        }
    );
    //barrel roll
    document.querySelector('#submit').classList.add('spin');
    setTimeout(() => {
        document.querySelector('#submit').classList.remove('spin');
    }, 1000);
}
form.addEventListener('submit', submit);

function setLocalStorage(){
    let formData = new FormData(form);
    let name = formData.get("ScoutName");
    let team = formData.get("ScoutTeamNum");
    let matchNum = formData.get("MatchNum")
    localStorage.setItem("name", name);
    localStorage.setItem("team", team);
    localStorage.setItem("match", matchNum)
}

function displaySavedData(){
    let scoutName = document.querySelector("input[name=ScoutName]");
    let teamNum = document.querySelector("input[name=ScoutTeamNum]");
    let matchNum = document.querySelector("input[name=MatchNum");
    scoutName.value = localStorage.getItem("name");
    teamNum.value = localStorage.getItem("team");
    matchNum.value = localStorage.getItem("match");
}

displaySavedData();

//check-super-box code
[...document.querySelectorAll('.check-super-box')].forEach((csb) =>
    csb.addEventListener('click', (e) => {
        let input = csb.querySelector('input');
        // input.checked = !input.checked;
        if (e.target.tagName == 'DIV') {
            input.click();
        }
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
            updateChargeStationCheckboxes();
        })
    );
});

//popups
/**
 * The function to make a yes/no confirm popup
 * @param {String} message The message to display
 * @param {function} callbackOnConfirmed The function to call when 'yes' is clicked
 * @param {function} callbackOnCancelled The function to call when 'no' is clicked
 */
function showConfirm(message, callbackOnConfirmed, callbackOnCancelled) {
    console.log('running');
    let okayButton = document.querySelector('#okay');
    okayButton.style = 'display: none;';
    let yesButton = document.querySelector('#yes');
    let noButton = document.querySelector('#no');
    yesButton.style = '';
    noButton.style = '';
    let confirmPopup = document.querySelector('.transparent');
    let paragraph = document.querySelector('#popup-message');
    paragraph.innerText = message;
    function handleYes(e) {
        closePopup();
        callbackOnConfirmed();
    }
    function handleNo(e) {
        closePopup();
        callbackOnCancelled();
    }
    function closePopup() {
        confirmPopup.style = 'display: none;';
        try {
            noButton.removeEventListener('click', handleNo);
            yesButton.removeEventListener('click', handleYes);
        } catch (e) {
            console.error(e);
        }
    }

    yesButton.addEventListener('click', handleYes);
    noButton.addEventListener('click', handleNo);
    confirmPopup.style = '';
    console.log('ran');
}
/**
 * The function to make a alert popup
 * @param {String} message The message to display
 */
function showAlert(message) {
    console.log('running');
    let yesButton = document.querySelector('#yes');
    let noButton = document.querySelector('#no');
    yesButton.style = 'display: none;';
    noButton.style = 'display: none;';
    let okayButton = document.querySelector('#okay');
    okayButton.style = '';
    let alertPopup = document.querySelector('.transparent');
    let paragraph = document.querySelector('#popup-message');
    paragraph.innerText = message;
    function handleOkay(e) {
        alertPopup.style = 'display: none;';
        okayButton.removeEventListener('click', handleOkay);
    }
    okayButton.addEventListener('click', handleOkay);
    alertPopup.style = '';
    console.log('ran');
}
//information buttons
[...document.querySelectorAll('#help,#help-media')].forEach(button => button.addEventListener('click', e => {
	window.open('https://docs.google.com/presentation/d/1A_ah3rh98wCnLV53Md-9dFzIz7zg2KHp60l6SF2APA0/edit?usp=sharing');
}));
