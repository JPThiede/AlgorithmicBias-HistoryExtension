// 
// function getAllURLsFromInstalltime (divName){
//     // Retrieve install timestamp
//     chrome.storage.sync.get("pauseTimes", function(result){
//         var pauseInts = result.pauseTimes;
//         var urls = [];
//         chrome.storage.sync.get("excludedDomains", function(result){
//             var excludedDomains = result.excludedDomains;
//             chrome.storage.sync.get("consentFlag", function(result){
//                     if (result.consentFlag){
//                         chrome.storage.sync.get("installTime", function(result){
//                             var time = result.installTime;
//                             chrome.history.search({
//                                 // Only return http(s) entries
//                                 'text': 'http',
//                                 // From the given start time onward
//                                 'startTime': time
//                             },
//                             function(historyItems){
//                                 // define the div we will append new elements to
//                                 var div = document.getElementById(divName);
                                
//                                 // Present the time for testing
//                                 var time = result.installTime;
//                                 // Converts ms since epoch into local UTC time (US CDT for us in IA)
//                                 var date = new Date(time);
//                                 var h3 = document.createElement("h3");
//                                 var h3Node = document.createTextNode("Install Time = " + date);
//                                 h3.appendChild(h3Node);
//                                 div.appendChild(h3);

                               
                    
//                             // iterate through the historyItems array returned in the callback function
//                             // print out all urls within
//                             for (var i = 0; i < historyItems.length - 1; i++){
//                                 if (!isInPauseInterval(historyItems[i].lastVisitTime, pauseInts)
//                                     && !containsExcludedDomain(historyItems[i].url, excludedDomains)){
//                                     var url = historyItems[i].url;
//                                     urls.push(url);
//                                     var p = document.createElement('p');
//                                     var pNode = document.createTextNode(printURL(url));
                            
//                                     p.appendChild(pNode);
//                                     div.appendChild(p);
//                                 } else {
//                                     var p = document.createElement('p');
//                                     var pNode = document.createTextNode("exluded entry");
                            
//                                     p.appendChild(pNode);
//                                     div.appendChild(p);
//                                 }
                                
//                             }
//                             //var port = chrome.runtime.connectNative('native.test')
//                             //port.postMessage({result: urls});
//                             }
//                             );
//                         });
//                     }else{
//                         chrome.storage.sync.get("installTime", function(result){
//                             var time = result.installTime;
//                             chrome.history.search({
//                                 // Only return http(s) entries
//                                 'text': 'http',
//                                 // From the given start time onward
//                                 'startTime': time
//                             },
//                             function(historyItems){
//                                 // define the div we will append new elements to
//                                 var div = document.getElementById(divName);
                                
//                                 // Present the time for testing
//                                 var time = result.installTime;
//                                 // Converts ms since epoch into local UTC time (US CDT for us in IA)
//                                 var date = new Date(time);
//                                 var h3 = document.createElement("h3");
//                                 var h3Node = document.createTextNode("Install Time = " + date);
//                                 h3.appendChild(h3Node);
//                                 div.appendChild(h3);
                    
//                             // iterate through the historyItems array returned in the callback function
//                             // print out all urls within
//                             for (var i = 0; i < historyItems.length - 1; i++){
//                                 if (!isInPauseInterval(historyItems[i].lastVisitTime, pauseInts)
//                                     && !containsExcludedDomain(historyItems[i].url, excludedDomains)){
//                                     var url = historyItems[i].url;
//                                     var p = document.createElement('p');
//                                     var pNode = document.createTextNode(printURL(url));
                            
//                                     p.appendChild(pNode);
//                                     div.appendChild(p);
//                                 } else {
//                                     var p = document.createElement('p');
//                                     var pNode = document.createTextNode("exluded entry");
                            
//                                     p.appendChild(pNode);
//                                     div.appendChild(p);
//                                 }
                                
//                             }
//                             }
//                             );
//                         });
//                     }
//                 })
//             });
//         });
 
    

// }

function printURL (url) {
    return String(url);
}

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
    var div = document.getElementById("links_div")
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

    chrome.storage.sync.get("giftLinks", function(result){
        var links = result.giftLinks;
        var h3 = document.createElement("h3");
        var h3Node = document.createTextNode("Gift Links:");
        h3.appendChild(h3Node);
        div.appendChild(h3);
        if (!(links.length == 0)) {
            
            for (var i = 0; i < links.length; i++){
                var p = document.createElement('p');
                var pNode = document.createTextNode(links[i]);
                p.appendChild(pNode);
                div.appendChild(p);
            }  
        } 
    });
    // getAllURLsFromInstalltime ("lasturl_div");
});
