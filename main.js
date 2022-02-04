const scriptURL = 'javascript:alert("submitted")'; //https://script.google.com/macros/s/AKfycbznj7NXYI0ANWuVM_PbcJWkNRDIKdg0rJ5fWhwZ9JNDVWTvCsoezmAPDt21qwwrDBycEQ/exec';

const form = document.forms['mainForm'];
requirements = Array.from(document.querySelectorAll('[required]'));
requirements.splice(0, 4);
var loadingElement =
    '<svg class="spinner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><style>.spinner{width:1em; animation: rotator 5s linear infinite;transform-origin: center;overflow: hidden;}@keyframes rotator{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.path {stroke-dasharray:270;stroke-dashoffset:0;transform-origin:center;stroke: #000000;animation: dash 1.4s ease-in-out infinite;}@keyframes dash{0%{stroke-dashoffset:265;}50%{stroke-dashoffset:65;transform:rotate(90deg);}100%{stroke-dashoffset: 265;transform:rotate(360deg);}}</style><circle class="path" fill="none" stroke-width="20" stroke-linecap="butt" cx="50" cy="50" r="40"></circle></svg>';

// Some data-related variables
var autoNumber = 0;
var teleNumber = 0;

// Define the increase and decrease functions (for buttons)
function increase(id) {
    var ele = document.getElementById(id);
    if ((Number(ele.value) || 0) < Number(ele.max)) {
        ele.value++;
    }
}

function decrease(id) {
    var ele = document.getElementById(id);
    if ((Number(ele.value) || 0) > Number(ele.min)) {
        ele.value--;
    } else {
        ele.value = 0;
    }
}

function setdefault(data, id) {
    if (data.get(id) === '') {
        data.append(id, 0);
        data.set(id, 0);
    }
}

// var fdata = null;

// Add the submit listener to the form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!confirm('are you sure you want to submit?')) return;
    document.getElementById('submitButton').disabled = true;
    document.getElementById('submitButton').innerHTML = 'Submitting ' + loadingElement;

    var data = new FormData(form);
    // ["BallsUpperAuto", "BallsUpperFailAuto", "BallsLowerAuto", "BallsLowerFailAuto", "BallsLowerTele", "BallsLowerFailTele", "BallsUpperTele", "BallsUpperFailTele"].forEach(id => setdefault(data, id));
    ['BreakdownElaboration', 'DefenseElaboration', 'Comments'].forEach((id) => {
        data.append(id, "'" + document.getElementById(id).value.replace(/(\r\n|\n|\r)/gm, '; '));
    });
    // data.append("Comments", "'" + document.getElementById("Comments").value.replace(/(\r\n|\n|\r)/gm, "; ")); // Replace newlines and other "naughty" characters
    data.set('ScoutName', "'" + data.get('ScoutName'));
    ['LowAutoSuccess', 'LowAutoMiss', 'HighAutoSuccess', 'HighAutoMiss', 'LowTeleSuccess', 'LowTeleMiss', 'HighTeleSuccess', 'HighTeleMiss'].forEach((id) => {
        if (!data.get(id)) {
            data.set(id, 0);
        }
    });
    fetch(scriptURL, {
        method: 'POST',
        body: data,
    })
        .then(
            (response) => (
                (document.getElementById('submitButton').innerHTML = 'Submitted'),
                console.log('Success!', response),
                setTimeout(function () {
                    alert('Success!'), (location = top.location.href);
                }, 10)
            )
        ) //setCookie("matchNumber", parseInt(getCookie("matchNumber"))+0),
        .catch((error) => (console.error('Error!', error.message), alert('Something went wrong...')));
    [
        'TeamNumScouted',
        'MatchNum',
        'NoShow',
        'Taxi',
        'HumanPlayerAttempt',
        'HumanPlayerSuccess',
        'LowAutoSuccess',
        'LowAutoMiss',
        'HighAutoSuccess',
        'HighAutoMiss',
        'LowTeleSuccess',
        'LowTeleMiss',
        'HighTeleSuccess',
        'HighTeleMiss',
        'LowClimbFell',
        'MidClimbFell',
        'HighClimbFell',
        'TraversalClimbFell',
        'Endstate',
        'ShotVersatility',
        'Defense',
        'OpponentCargo',
        'Mnv',
        'Intake',
        'ClimbSpeed',
        'Breakdown',
        'Comments',
    ].forEach((id) => setdefault(data, id));
});

// Set saved data/default data in the fields
if (document.cookie.length >= 1) {
    document.getElementById('ScoutName').value = getCookie('scoutName');
    document.getElementById('ScoutTeamNum').value = getCookie('scoutTeamNum');
    //document.getElementById("MatchNumber").value = getCookie("matchNumber");
}
// Set cookie setters
document.getElementById('ScoutName').addEventListener('keyup', function (event) {
    setCookie('scoutName', document.getElementById('ScoutName').value);
});
document.getElementById('ScoutTeamNum').addEventListener('keyup', function (event) {
    setCookie('scoutTeamNum', document.getElementById('ScoutTeamNum').value);
});

// Set the NoShow checkbox to show the dropdown if checked
document.getElementById('NoShow').addEventListener('change', function (event) {
    if (document.getElementById('NoShow').checked) {
        requirements.forEach(function (element) {
            element.required = false;
        });
    } else if (!document.getElementById('NoShow').checked) {
        requirements.forEach(function (element) {
            element.required = true;
        });
    }
});

// Set the Breakdown checkbox to show the dropdown if checked
document.getElementById('Breakdown').addEventListener('change', function (event) {
    if (document.getElementById('Breakdown').value == 1) {
        requirements.forEach(function (element) {
            element.required = false;
        });
        document.getElementById('Boosts').checked = false;
        document.getElementById('Fall').checked = false;
        dropDown();
    } else if (document.getElementById('NoShow').value == 0) {
        requirements.forEach(function (element) {
            element.required = true;
        });
    }
});

function starInput(inputName, val) {
    document.getElementById(inputName).value = val;
}

function scoreDisplay(bettingScore) {
    document.getElementById('myScore').innerHTML = bettingScore;
    //displays current amount of points a person can bet
}

function deselect(name) {
    //goes through and clears selected radio buttons with the given name
    var x = document.getElementsByName(name);
    for (var i = 0; i < x.length; i++) {
        x[i].checked = false;
    }
}

function dropDown(name, parent) {
    //causes menus to drop down when a button is selected
    var x = document.getElementsByName(name);
    if (parent.checked) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.toggle('fade-out');
            x[i].classList.toggle('fade-in');
            x[i].parentNode.insertBefore(document.createElement('br'), x[i].nextSibling);
        }
    } else {
        for (var i = 0; i < x.length; i++) {
            x[i].checked = false;
            x[i].classList.toggle('fade-out');
            x[i].classList.toggle('fade-in');
            x[i].parentNode.removeChild(x[i].nextElementSibling);
        }
    }
}

// Cookie helper functions
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
    //checks if a cookie exists, if it does it returns it, if not it returns null
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}

function radio(ele) {
    document.getElementById(ele).checked = true;
}

function toggle(id, val) {
    document.getElementById(id).style = 'display: ' + (val > 0 ? 'block' : 'none') + ';';
}
