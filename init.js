// Code which initializes the extension on install
// Assigns randomized ID 
// TODO: Create and store timestamp of install time

// Generates a random alphanumeric string
// Slices off the front 2 charaters (they are always 0.)
function generateRandomId (){
    return Math.random().toString(36).slice(2)

}

function getInstallTimestamp (){
    var date = new Date();
    var timestamp = date.getTime();
    return timestamp;
}

// Store a persistent randomized id to associate with this instance
function storeID (){
   var id = generateRandomId();
   chrome.storage.sync.set({"id": id}, function(){
        console.log("ID = " + id);
        //window.alert("ID = " + id);
   });

}

// Define an event listener which triggers on extension installation
chrome.runtime.onInstalled.addListener( storeID );