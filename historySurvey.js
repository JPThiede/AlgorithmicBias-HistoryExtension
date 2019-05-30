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

// Version 0.2 - Getting closer to actual use-case functionality
// Randomized persistent IDs 
// Timestamps
// Search method based on time, filters out non http/https entries
// Things to add:
// Query data on a 24 hour cycle
// Work out specifics of our web server/database
// Work out how to properly secure/encrypt/anonymize data
// Will need to create pages/tabs to inform participants of collection
// Still unclear of how exactly consent will be gathered
// If they opt out midway, do we have to expunge their data already sent?

// TODO: Ignore files opened in Chrome (pdfs, etc.) 
// If doesn't start w/ http or https drop
// Filters in the search method
// DONE

// TODO: Find ways to strip PII entered in data fields/forms
// While not stripping all parameters (otherwise browsing on Google/Youtube/etc. loses a lot of value)

// TODO: Confirm that "startTime" is indeed measured in terms of miliseconds since 1/1/1970 
// If that is true, then defining a timestamp for the install time is an easy way to limit what we are allowed to query from history
// i.e. define and store a value from Date.getTime() on install (timestamp represented by ms since 1/1/1970)
// DONE

// TODO: If we are going to present the install timestamp to users to show where our survey starts, we should convert to date format
// Milliseconds since the epoch is not an incredibly clear measure of time to conceptualize 
// DONE

// TODO: The search method does not return multiple visits to the same URL
// Unsure if this is a product of the history search method, or the way Chrome itself handles history
// Can edit this to report multiple visits if necessary, but could mean we need to use "browsingHistory" api instead 
// Or we may need to use getVisits method from the history api
// Will do more digging

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

// This function is getting closer to the final version of how this should look
// This function now limits what is queried by the search function to after the install time
// Things to note: there is a default value for a parameter "maxResults" that defaults to 100
// TODO: Will need to find a reasonable number to override this with, or find some way to ignore that parameter
// Or we could just use some unreasonable number as well: final version will have much smaller time windows which will already limit the size of query results
// Final version of the history query will need to keep a rolling timestamp for each 24 hour period we query, and use that instead of the install timestamp
// Final version wont necesarily need to be editing/creating html elements 
// (Unless for the sake of transparency we want to show participants what data is being queried)
function getAllURLsFromInstalltime (divName){
    // Retrieve install timestamp
    chrome.storage.sync.get("pauseTimes", function(result){
        var pauseInts = result.pauseTimes;
        chrome.storage.sync.get("excludedDomains", function(result){
            var excludedDomains = result.excludedDomains;
            chrome.storage.sync.get("consentFlag", function(result){
                    if (result.consentFlag){
                        chrome.storage.sync.get("installTime", function(result){
                            var time = result.installTime;
                            chrome.history.search({
                                // Only return http(s) entries
                                'text': 'http',
                                // From the given start time onward
                                'startTime': time
                            },
                            function(historyItems){
                                // define the div we will append new elements to
                                var div = document.getElementById(divName);
                                
                                // Present the time for testing
                                var time = result.installTime;
                                // Converts ms since epoch into local UTC time (US CDT for us in IA)
                                var date = new Date(time);
                                var h3 = document.createElement("h3");
                                var h3Node = document.createTextNode("Install Time = " + date);
                                h3.appendChild(h3Node);
                                div.appendChild(h3);
                    
                            // iterate through the historyItems array returned in the callback function
                            // print out all urls within
                            for (var i = 0; i < historyItems.length - 1; i++){
                                if (!isInPauseInterval(historyItems[i].lastVisitTime, pauseInts)
                                    && !containsExcludedDomain(historyItems[i].url, excludedDomains)){
                                    var url = historyItems[i].url;
                                    var p = document.createElement('p');
                                    var pNode = document.createTextNode(printURL(url));
                            
                                    p.appendChild(pNode);
                                    div.appendChild(p);
                                } else {
                                    var p = document.createElement('p');
                                    var pNode = document.createTextNode("exluded entry");
                            
                                    p.appendChild(pNode);
                                    div.appendChild(p);
                                }
                                
                            }
                            }
                            );
                        });
                    }else{
                        window.alert("Gathering is paused!");
                    }
                })
            });
        });
 
    

}

function printURL (url) {
    return String(url);
}

function timeTest(){
    window.alert("TIME INTERVAL TEST")
}

function isInPauseInterval(urlVisitTime, pauseInts){
   for (var i = 0; i < pauseInts.length; i += 2){
       if (urlVisitTime > pauseInts[i].timestamp && urlVisitTime < pauseInts[i+1].timestamp){
           return true
       }
   }
   return false;
}

function containsExcludedDomain(url, excludedDomains){
    for (var i in excludedDomains){
        //doms = domain.split(".")
        if (url.includes(excludedDomains[i])){
            return true;
        }
    }
    return false;
}
// This listener triggers whenever the extension icon is clicked and its content loaded
document.addEventListener('DOMContentLoaded', function () {
    var div = document.getElementById("lasturl_div")
    chrome.storage.sync.get("consentFlag", function(result){
        if(result.consentFlag){
            document.getElementById("pauseAll").innerText = "Pause All Collection"
        } else {
            document.getElementById("pauseAll").innerText = "Resume All Collection"
        }
    });
    // Retrieve ID associated with this instance of the extension
    // Create elements to show id
    chrome.storage.sync.get("id", function(result){
        var id = result.id;
        var h3 = document.createElement("h3");
        var h3Node = document.createTextNode("Id = " + id);
        h3.appendChild(h3Node);
        div.appendChild(h3);
    });
    getAllURLsFromInstalltime ("lasturl_div");
});