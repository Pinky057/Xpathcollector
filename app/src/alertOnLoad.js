"use strict";

window.onload = function () {
    var urlParams = new URLSearchParams(window.location.search);
    var customFlag = urlParams.get('customFlag');
    console.log("customFlag", customFlag);

    if (customFlag === 'someValue') {
        // Flag found, indicating previous navigation
        console.log("removing customFlag", customFlag);
        // Remove the flag from the URL before navigating back
        var url = removeUrlParameter(window.location.href, 'customFlag');
        window.history.replaceState({}, document.title, url);
    } else {
        console.log("Adding listener for document: ", document);
        var isDevToolsActive = false;

        chrome.runtime.sendMessage({ request: "activeDevTools", data: "remove me" }, function(response) {
            console.log('Received response from devtools/Panel ', response);
            isDevToolsActive = response.reply;
            if (isDevToolsActive) {
                let userResponse = confirm('Page has reloaded! Do you want to go to the display page?');
                if (userResponse) {
                    // Navigate to the display page 
                    const newWindow = window.open(chrome.runtime.getURL('display.html'), '_blank');
                } else {
                    // Get the previous page URL
                    var previousUrl = document.referrer;
                    // Append the customFlag parameter to the URL
                    var modifiedUrl = addUrlParameter(previousUrl, 'customFlag', 'someValue');
                    // Load the previous page with the modified URL
                    window.location.href = modifiedUrl;
                }
            }
        });
    }
};

// Function to add a parameter to the URL
function addUrlParameter(url, key, value) {
    var separator = (url.indexOf('?') !== -1) ? '&' : '?';
    return url + separator + encodeURIComponent(key) + '=' + encodeURIComponent(value);
}

// Function to remove a parameter from the URL
function removeUrlParameter(url, key) {
    var urlParts = url.split('?');
    if (urlParts.length >= 2) {
        var prefix = encodeURIComponent(key) + '=';
        var queryParams = urlParts[1].split(/[&;]/g);
        for (var i = queryParams.length; i-- > 0;) {
            if (queryParams[i].lastIndexOf(prefix, 0) !== -1) {
                queryParams.splice(i, 1);
            }
        }
        url = urlParts[0] + (queryParams.length > 0 ? '?' + queryParams.join('&') : '');
    }
    return url;
}
