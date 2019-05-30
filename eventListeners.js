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
            //window.alert("Resumed at " + timeUTC);
        });
        // Find the timestamp of the last pause to associate w/ this resume time
        chrome.storage.sync.get("lastPause", function(result){
            var last = result.lastPause;
            //window.alert("LAST PAUSE = " + last);
            // Get the pauseTimes JSON object
            chrome.storage.sync.get("pauseTimes", function(result){
                // Add the current (resume) time to the JSON obj w/ key corresponding to its corresponding pause time
                var pauseTimestamps = result.pauseTimes;
                pauseTimestamps.push({[last]: currentTime});
                // Set the new JSON object to storage
                chrome.storage.sync.set({"pauseTimes": pauseTimestamps}, function(){
                    chrome.storage.sync.get("pauseTimes", function(result){
                        var pt = result.pauseTimes;
                        window.alert("JSON = " + JSON.stringify(pt));
                    });
                });
            });
        });
    } else {
        document.getElementById("pauseAll").innerText = "Resume All Collection"
        var currentTime = (new Date).getTime();
        var timeUTC = new Date(currentTime);
        chrome.storage.sync.set({"consentFlag": false}, function(){
            //window.alert("Paused at " + timeUTC);
        });
        // Get the stored JSON object and add the current timestamp to it in format {pauseTime: pauseTime}
        chrome.storage.sync.get("pauseTimes", function(result){
            var pauseTimestamps = result.pauseTimes;
            pauseTimestamps.push({[currentTime]: currentTime});
            chrome.storage.sync.set({"pauseTimes": pauseTimestamps}, function(){
                window.alert("JSON = " + JSON.stringify(pauseTimestamps));
            });
        });
        // Set a variable for the pauseTime 
        // This way, when we resume, the resume timestamp can be added to the JSON object in format {pauseTime: resumeTime}
        chrome.storage.sync.set({"lastPause": currentTime}, function(){

        });
    }
        
})