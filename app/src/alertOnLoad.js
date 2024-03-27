"use strict";
document.addEventListener('DOMContentLoaded', function () {
    console.log("Adding listener for document: ", document);
    //console.log("Adding listener for document URL URI: ", document.URL, document.baseURI);
    var isDevToolsActive = false;
    chrome.runtime.sendMessage({ request: "activeDevTools", data: "remove me" }, function (response) {
        console.log('Received response from devtools/Panel ', response);
        isDevToolsActive = response.reply;
        if (isDevToolsActive) {
            let userResponse = confirm('Page has reloaded! Do you want to go to the display page?');
            if (userResponse) {
                const newWindow = window.open(chrome.runtime.getURL('display.html'), '_blank');
            }
        }
    });
});