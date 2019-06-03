
function sendMessageNative(message){
    var port = chrome.runtime.connectNative('native.test');
    port.postMessage({text: test});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    var test = request.text;
    //window.alert(test)
    chrome.runtime.sendNativeMessage('native.test', {text: test})
});