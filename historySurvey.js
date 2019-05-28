// Chrome Extension to gather browsing habits of participants
// Used as part of the project "Auditing the Incidence and Impact of Algorithmic Personalization and Bias on Fringe Communities" 
// We are seeking to better understand the impact of algorithmic bias/personalization
// Data will be used to reconstruct profiles that will be used to automatically mimic browsing habits 
// No Personally Identifiable Information (PII) will be collected in the process of this survey, 
// any PII entered on a webpage will be dropped
// Each user will remain completely anonymous and unlinkable: extension will generate random id numbers
//
// Version 0.1 - Very early testing of the chrome.history method + randomized ids
// Things to clarify:
// How data collection will go: what will users consent to us logging? Only from Install time onward?
// How we send/store data: is it sent on the fly? In a large single batch at the end of their usage? Predetermined intervals?
// How will data be sent/stored?

// TODO: Ignore files opened in Chrome (pdfs, etc.) 
// If doesn't start w/ http or https drop
// Filters in the search method?

// TODO: Find ways to strip PII entered in data fields/forms
// While not stripping all parameters (otherwise browsing on Google/Youtube/etc. loses a lot of value)

// TODO: Confirm that "startTime" is indeed measured in terms of miliseconds since 1/1/1970 
// If that is true, then defining a timestamp for the install time is an easy way to limit what we are allowed to query from history
// i.e. define and store a value from Date.getTime() on install (timestamp represented by ms since 1/1/1970)
// CONFIRMED

// TODO: If we are going to present the install timestamp to users to show where our survey starts, we should convert to date format
// Milliseconds since the epoch is not an incredibly clear measure of time to conceptualize 


// Pilot Test to understand the functions of chrome.history 
// Prints the last visted url in a popup window
function getSingleURL (divName){
    chrome.history.search({
        'text': ''
    },
    function(historyItems){
        var div = document.getElementById(divName);
        var url = historyItems[0].url;
        var p = document.createElement('p');
        var pNode = document.createTextNode(printURL(url));
        p.appendChild(pNode);
        div.appendChild(p);
    }
    )
}

// More Testing
// Also shows we can retrieve persistent, random id assigned at install time
// Continued testing: retrieve install timestamp
// TODO: test timestamp w/ the start time search parameters
// Concert timestamp to UTC?
function getTenURLs (divName) {
    chrome.history.search({
        'text': ''
    },
    function(historyItems){
        var div = document.getElementById(divName);
        chrome.storage.sync.get("id", function(result){
            var id = result.id;
            var h3 = document.createElement("h3");
            var h3Node = document.createTextNode("Id = " + id);
            h3.appendChild(h3Node);
            div.appendChild(h3);
        }); 
        
        chrome.storage.sync.get("installTime", function(result){
            var time = result.installTime;
            var h3 = document.createElement("h3");
            var h3Node = document.createTextNode("Install Time = " + time);
            h3.appendChild(h3Node);
            div.appendChild(h3);
        });
       
        for (var i = 0; i < 10; i++){
            var url = historyItems[i].url;
            var p = document.createElement('p');
            var pNode = document.createTextNode(printURL(url));
           
            p.appendChild(pNode);
            div.appendChild(p);
        }
    }
    )
    
}

function printURL (url) {
    return String(url);
}



document.addEventListener('DOMContentLoaded', function () {
    getTenURLs ("lasturl_div");
});