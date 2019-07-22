// Script in which we aggregate all of our event listeners

paramWL = ["q=", "query=", "search=", "search_query=", "searchtext=", "searchkey="];

// Event listener for the blanket pause button
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

document.getElementById("excludePage").addEventListener("click", function(tab){
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        var currentTab = tab[0];
        window.alert("TEST: " + currentTab.url);
        chrome.storage.sync.get("excludedDomains", function(result){
            var domains = result.excludedDomains;
            domains.push(currentTab.url);
            chrome.storage.sync.set({"excludedDomains": domains}, function(){
                console.log("Added: " + currentTab.url);
            });
        });

    });
    
});

document.getElementById("testXHR").addEventListener("click", function testXHR(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://128.255.96.34:2812", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200){
            var resp = xhr.responseText;
            window.alert("Resp: " + resp);
            chrome.storage.sync.get("giftLinks", function(result){
                links = result.giftLinks;
                links.push(resp);
                chrome.storage.sync.set({"giftLinks": links});
            });
        }
    };
    chrome.storage.sync.get("id", function(result){
        var uid = result.id;
        var time = (new Date).getTime();
        chrome.history.search({
            'text': 'http',
        },
        function(historyItems){
            var items = {};
            var urls = [];
            var strippedUrls = [];
            
            for (var i = 0; i < historyItems.length; i++){
                var params = "";
                var splitParams = [];
                // urls.push(historyItems[i].url);
                // strippedUrls.push(historyItems[i].url.split('?')[0]);
                var url = historyItems[i].url.split('?')[0];
                params = (historyItems[i].url.split('?')[1]);
                if (!(params === undefined)){
                    url = url + '?'
                    splitParams = params.split('&');
                    for (var j = 0; j < splitParams.length; j++){
                        if (paramWL.some(function(element) {return splitParams[j].includes(element)} )){
                            url = url + '&' + splitParams[j];
                        }
                    }
                }
                urls.push(url);
            }
            
            items.uid = uid;
            items.time = time;
            items.urls = urls;
            xhr.send(JSON.stringify(items));
        });
    });
    
    
})