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
    let value = e.value;
    input.value = value;
    //styling
    let before = true;
    [...q_row.querySelectorAll('button')].forEach((input) => {
        input.className = '';
        if (e.value == -1) return;
        if (before) {
            input.className = 'starred';
        }
        if (input == e) {
            before = false;
        }
    });
}

let breakdownCheckbox = document.querySelector("input[name=Breakdown]");
breakdownCheckbox.addEventListener('change', (e)=>{
    let breakdownElab = document.querySelector('#breakdownCommentBox')
    let breakdownBox = document.querySelector('textarea[name=BreakdownCom]')
    if(breakdownCheckbox.checked == true){
        let newValue = localStorage.getItem('breakdown')
        breakdownBox.value = newValue;
        breakdownElab.style = "";
    }
    else{
        breakdownElab.style = 'display:none';
        localStorage.setItem("breakdown", breakdownBox.value)
        breakdownBox.value = ''
    }
})

/**
 * Function to delete inputs upon submission and no show toggle
 */
function clearInputs(){
    [...document.querySelectorAll('input')].forEach((input) => {
        let name = input.name;
        if (!['ScoutName', 'ScoutTeamNum', 'TeamNumScouted', 'MatchNum', 'NoShow'].includes(name)) {
            if (input.type == 'text') {
                input.value = '';
            }
            else if (input.type == 'number') {
                input.value = 0;
            }
            else if (input.type == 'checkbox') {
                input.checked = false;
            }
            else if(input.type == 'hidden'){
                input.value = -1;
            }
        }
    });
    //removing stars and radio buttons
    [...document.querySelectorAll('.starred')].forEach((starredButton) =>{
        starredButton.classList.remove('starred');
    })
    // let checkedRadioAuto = document.querySelector('#auto-charge-none');
    // let checkedRadioEndgame = document.querySelector('#end-charge-none');
    // checkedRadioAuto.checked = true;
    // checkedRadioEndgame.checked = true;

    //removing text boxes
    let breakdownElab = document.querySelector('[name=BreakdownCom]');
    let generalComments = document.querySelector('[name=GeneralCom]');
    let defenseCom = document.querySelector('[name=DefenseCom]');
    breakdownElab.value = '';
    generalComments.value = '';
    defenseCom.value = '';
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
        alert('Please make sure you have provided all information (top 4 fields)');
        return;
    }
    if (!confirm('Are you sure you want to submit?')) {
        return;
    }
    //disable submit button
    [
        { time: 'auto', cap: 'Auto' },
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
    })
        .then((response) => {
            console.log(response);
            if (response.status !== 200) {
                alert('There was a problem submitting... please try again.');
                return;
            }
            alert('Thank you!');
            //resets the form
            clearInputs();
            let noShow = document.querySelector('input[name=NoShow]');
            noShow.checked = false;
            localStorage.removeItem("inGameData");
            noShowToggleHandler();
            let teamNumScouted = document.querySelector('input[name=TeamNumScouted]');
            teamNumScouted.value = "";
            let matchNum = document.querySelector('input[name=MatchNum]');
            matchNum.value ++;
            setLocalStorage();
        })
        .catch((error) => {
            console.log(error);
            alert('There was a problem... please try again and notify the Team 2485 Analytics department if this happens again.');
        });
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