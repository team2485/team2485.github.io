/*
* Author: Brett Kim
*/

//Column arrays

var entry;
var TABLE_COLUMNS = 13;

$(function() {
    var sheetURL = 'https://spreadsheets.google.com/feeds/cells/1EMAV9BxUnAs-Jtvn6QsIpkik5LW6odRa8bLyxc4aMlw/6/public/full?alt=json';

    $.getJSON(sheetURL, function(data) {
        entry = data.feed.entry;

        output = "";

        output += "<table>";

        var newTableRow = false;
        var firstTime = true;

        var colCount = -1;
        for(i = 0; i < entry.length; i++) {

            colCount++;

            if(colCount == TABLE_COLUMNS) {
                output += "</tr>";
                firstTime = false;
                colCount = 0;
                newTableRow = true;
                console.log("Row");
                output += "<tr>";
            }

            if(firstTime) {
                output += "<th>";
                output += entry[i].content.$t;
                output += "</th>";
            } else {
                if(colCount == 1) {
                    output += "<td class=\"score\">";
                    output += entry[i].content.$t;
                    output += "</td>";
                } else {
                    output += "<td>";
                    output += entry[i].content.$t;
                    output += "</td>";
                }
            }

            console.log("#: " + colCount + " Entry: " + entry[i].content.$t);
        }
        output += "</table>";
    
        document.getElementById("team").innerHTML = output;

        console.log(entry);
    })
});