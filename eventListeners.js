// Script in which we aggregate all of our event listeners


// Event listener for the blanket pause button
// TOOO: Figure out ways in which to pause specific spans of time
// variables for start/end timestamps of the pause period?
// Use these to exclude in chrome history search?
// FOR TOMMOROW:
// serach returns HistoryItems -> HistoryItems can be fed into getVisits -> getVisits returns VisitItem -> VisitItem.visitTime can see if any visits to that site were within that timespan -> drop from collection?
// Store time intervals in a JSON-like object stored in sync storage:
// Format [{pauseTime1: pauseTime1}, {pauseTime1: resumeTime1, {pauseTime2: resumeTime2}, {pauseTime2: resumeTime2}...]
// For each interval, associate w/ time of pause, then iterate through and exclude anything within the bounds
// If there is an odd number: ([{pause1: pause1}]), then consentFlag will be set to false, and we can just use the interval [pause1, currentTime]
// TODO: This can likely be simplified in the future
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
                pauseTimestamps.push({pauseStart : last, timestamp : currentTime});
               
                // Set the new JSON object to storage
                chrome.storage.sync.set({"pauseTimes": pauseTimestamps}, function(){
                    chrome.storage.sync.get("pauseTimes", function(result){
                        var pt = result.pauseTimes;
                        var str = "";
                        for (var i in pt){
                            str += "Object = " + JSON.stringify(pt[i]);
                            str += "pauseTime = " + pt[i].pauseStart + " timestamp = " + pt[i].timestamp + "\n";
                        }

                        window.alert(str);
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
        // Get the stored JSON-like object and add the current timestamp to it in format {pauseTime: pauseTime}
        chrome.storage.sync.get("pauseTimes", function(result){
            var pauseTimestamps = result.pauseTimes;
            pauseTimestamps.push({pauseStart: currentTime, timestamp: currentTime});
            
            chrome.storage.sync.set({"pauseTimes": pauseTimestamps}, function(){
                window.alert("JSON = " + JSON.stringify(pauseTimestamps));
            });
        });
        // Set a variable for the pauseTime 
        // This way, when we resume, the resume timestamp can be added to the JSON object in format {pauseTime: resumeTime}
        chrome.storage.sync.set({"lastPause": currentTime}, function(){

        });
    }
        
});

// Event listener for the exclude domain button 
// Prompts the user to enter a domain/website to exclude from the collection
// 
document.getElementById("excludeDomain").addEventListener("click", function excludeDomain(){
    var domain = prompt("Enter a website domain to exclude from our gathering: ", "");
    //window.alert("retVal = " + domain);
    if (domain != null){
        chrome.storage.sync.get("excludedDomains", function(result){
            var domains = result.excludedDomains;
            domains.push(domain);
            chrome.storage.sync.set({"excludedDomains": domains}, function (){
                window.alert("domains = " + JSON.stringify(domains));
            })
                
            
        });
    }
});

document.getElementById("listExcluded").addEventListener("click", function listExcluded(){
    chrome.storage.sync.get("excludedDomains", function(result){
        var domains = result.excludedDomains;
        if (!(domains.length == 0)){
            var list = "";
            for (var i = 0; i < domains.length; i++){
                list += domains[i] + "\n";
            }
            window.alert("List of excluded domains:\n" + list);
        } else {
            window.alert("No domains have been excluded")
        }
    });
})

document.getElementById("testXHR").addEventListener("click", function testXHR(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:2812", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200){
            window.alert("Sent");
        }
    };

    chrome.history.search({
        'text': 'http',
    },
    function(historyItems){
        
        var urls = [];
        
        
        for (var i = 0; i < historyItems.length; i++){
            urls.push(historyItems[i].url);
        }
        
        
        xhr.send(urls);
    });
    
})

// document.getElementById("testNA").addEventListener("click", testNativeApp)

// function testNativeApp(){
//     var test = prompt("Enter a test string to send to native app: ", "");
//     var port = chrome.runtime.connectNative('native.test');
//     port.onMessage.addListener(onNMessage);
//     window.alert("TEST");
//     port.postMessage({text: test});
//     port.disconnect();
   
//     //chrome.runtime.sendNativeMessage('native.test', {text: test});

    
//     //port.onMessage.addListener(onNMessage)
// }

// function onNMessage(message){
//     window.alert("Message received: " + message);
// }