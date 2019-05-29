// Script in which we aggregate all of our event listeners


// Event listener for the blanket pause button
// TOOO: Figure out ways in which to pause specific spans of time
// variables for start/end timestamps of the pause period?
// Use these to exclude in chrome history search?
// FOR TOMMOROW:
// serach returns HistoryItems -> HistoryItems can be fed into getVisits -> getVisits returns VisitItem -> VisitItem.visitTime can see if any visits to that site were within that timespan -> drop from collection?
document.getElementById("pauseAll").addEventListener("click", function pauseAll(){
    if (document.getElementById("pauseAll").innerText == "Resume All Collection"){
        document.getElementById("pauseAll").innerText = "Pause All Collection"
        var currentTime = (new Date).getTime();
        var timeUTC = new Date(currentTime);
        chrome.storage.sync.set({"consentFlag": true}, function(){
            window.alert("Resumed at " + timeUTC);
        });
    } else {
        document.getElementById("pauseAll").innerText = "Resume All Collection"
        var currentTime = (new Date).getTime();
        var timeUTC = new Date(currentTime);
        chrome.storage.sync.set({"consentFlag": false}, function(){
            window.alert("Paused at " + timeUTC);
        });
    }
        
})