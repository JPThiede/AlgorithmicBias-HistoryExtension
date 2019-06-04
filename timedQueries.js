// Handles timing events and history queries
// Every 24 hours, make a history query and then store/send the data
// 86400000 ms = 24 hours

// TODO: Will eventually move the history queries into this file

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
        window.alert("SPARTA Browsing History Survey: 24 hour cycle has passed, browsing data will be sent");
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

// This function will query all history from 24 hours ago
// Callback function invokes the native python app
function get24HoursOfHistory(){
    var start = (new Date).getTime() - 86400000
    var currentTime = (new Date).getTime();
    
    chrome.storage.sync.set({"lastQuery": currentTime}, function(){
        console.log("Time:" + currentTime);
    });

    chrome.history.search({
        'text': '',
        'startTime': start,
        'maxResults': 100
    }, 
    function(historyItems){
        var urls = []
        for (var i = 0; i < historyItems.length; i++){
            urls.push(historyItems[i]);
        }
        var port = chrome.runtime.connectNative('native.test')
        port.postMessage({result: urls});
    });
}

//
var testTimer = setInterval(dayPassed, 10000);

//var dayTimer = setInterval(timeTest, 86400000);