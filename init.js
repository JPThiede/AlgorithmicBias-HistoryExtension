// Code which initializes the extension on install
// Assigns randomized ID 
// Assigns timestamp at install time

// Generates a random alphanumeric string
// Slices off the front 2 charaters (they are always 0.)
function generateRandomId (){
    return Math.random().toString(36).slice(2)

}

// Using JavaScript Date class, generate a timestamp
// Measured in milliseconds since the UNIX epoch (1/1/1970)
function getInstallTimestamp (){
    var date = new Date();
    var timestamp = date.getTime();
    return timestamp;
}

// Store a persistent randomized id to associate with this instance
// Uses Chrome Extension storage to store this ID persistently
// Store first "lastQuery" as install time?
function storeID (){
   var id = generateRandomId();
   chrome.storage.sync.set({"id": id}, function(){
        console.log("ID = " + id);
        //window.alert("ID = " + id);
   });

}

// Store the install time timestamp for this instance of the extension
function storeTimestamp (){
    var time = getInstallTimestamp();
    chrome.storage.sync.set({"installTime": time}, function(){
        console.log("Timestamp = " + time);
        window.alert("Timestamp = " + time);
    });
    chrome.storage.sync.set({"lastQuery": time}, function(){
        console.log("Timestamp = " + time);
    });
}

// Function which aggregates the above functions
function initilize (){
    storeID();
    storeTimestamp();
}

// Define an event listener which triggers on extension installation
// Run the initilization code on install
chrome.runtime.onInstalled.addListener( initilize );