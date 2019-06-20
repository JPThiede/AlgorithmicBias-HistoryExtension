// Handles timing events and history queries
// Every 24 hours, make a history query and then store/send the data
// 86400000 ms = 24 hours


// Current solution for timing: have an interval set to something short
// This interval runs a function which checks if a day has passed from now and the last query
// If true, then trigger a new query
// Else do nothing 

function timeTest(){
    window.alert("TIME INTERVAL TEST")
}

function backgroundHistoryTest(){
    chrome.history.search({
        'text': ''
    },
    function(historyItems){
        window.alert("Last Page:" + historyItems[0].url);
    })
}

// Check if day has passed
// If true -> trigger a new query
// If false -> continue waiting
// Run this on a timer at some reasonable interval
// This way, we don't have to worry about user having the browser open at a specific time
// TODO: Run this for a while and make sure it is actually working on the 24 hour cycle
function dayPassed(){
    var currentTime = (new Date).getTime();
    chrome.storage.sync.get('lastQuery', function(result){
        //window.alert("SPARTA Browsing History Survey: 24 hour cycle has passed, browsing data will be sent");
        if ((currentTime - result.lastQuery) > 86400000){
            //alertTrue();
            get24HoursOfHistory();
            return true;
        } else{
            //alertFalse();
            return false;
        }
    });
    //window.alert("last query: " + lastQuery);
}
function alertTrue(){
    window.alert("True");
}

function alertFalse(){
    window.alert("False");
}

// Function which queries the last 24 hours of browser history, excludes the appropriate entries, and sends the rest to the server
function get24HoursOfHistory(){
    var start = (new Date).getTime() - 86400000
    var currentTime = (new Date).getTime();
    chrome.storage.sync.get("pauseTimes", function(result){
        var pauseInts = result.pauseTimes;
        chrome.storage.sync.get("excludedDomains", function(result){
            var excludedDomains = result.excludedDomains;
            chrome.history.search({
                'text': 'http',
                'startTime': start,
                'maxResults': 100
            },
            function(historyItems){
                var urls = [];
                for (var i = 0; i < historyItems.length - 1; i++){
                    //Ensure that the current url is neither within a pause interval nor in an excluded domain/page 
                    if (!isInPauseInterval(historyItems[i].lastVisitTime, pauseInts)
                        && !containsExcludedDomain(historyItems[i].url, excludedDomains)){
                            //Push to urls
                            urls.push(historyItems[i].url);
                    } else {
                        //Skip
                        continue;
                    }
                }
                 //Send collected data to server   
                chrome.storage.sync.get("id", function(result){
                    var items = {};
                    items.uid = result.id;
                    items.time = (new Date).getTime();
                    items.urls = urls;
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "http://128.255.96.34:2812", true);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function(){
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200){window.alert("SPARTA@Iowa Extension: 24 hours passed, browsing data has been transferred");}};
                    xhr.send(JSON.stringify(items));
                });
            });
            });
        });
    //Set the last query time to now upon completion
    chrome.storage.sync.set({"lastQuery": currentTime}, function(){
        console.log("Time:" + currentTime);
    });
}

//General functions below

//Check if a given url has been visited during paused time
function isInPauseInterval(urlVisitTime, pauseInts){
    if (pauseInts.length%2 == 0){
         for (var i = 0; i < pauseInts.length; i += 2){
             if (urlVisitTime > pauseInts[i].timestamp && urlVisitTime < pauseInts[i+1].timestamp){
                 return true;
             }
         }
         return false;
    } else {
         for (var i = 0; i < pauseInts.length-1; i += 2){
             if (urlVisitTime > pauseInts[i].timestamp && urlVisitTime < pauseInts[i+1].timestamp){
                 return true;
             }
             
         }
         if (urlVisitTime > pauseInts[pauseInts.length-1].timestamp){
             return true;
         } 
         return false;
    }
  
 }
 
 //Check if the url contains an excluded domain
 function containsExcludedDomain(url, excludedDomains){
     for (var i in excludedDomains){
         //doms = domain.split(".")
         if (url.includes(excludedDomains[i])){
             return true;
         }
     }
     return false;
 }

// Set a timer on a short interval that checks if 24 hours have passed since last data sent
// This way, as long as the participant opens their browser some time after the 24 hour period, it will still trigger
// Setting a regular 24 hour timer only works if the user has their browser open at the exact time every day
var oneDayCheckTimer = setInterval(dayPassed, 5000);

// var timerTest = setInterval(get24HoursOfHistory, 10000);


//var dayTimer = setInterval(timeTest, 86400000);