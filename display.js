// display.js

var bkg = chrome.extension.getBackgroundPage();

window.onload = function () {
    var savedItems = JSON.parse(localStorage.getItem("selectedItems"));
    var displayElement = document.getElementById("display");
    displayElement.innerHTML = savedItems ? savedItems.join(", ") : "No items have been saved.";
}

// Listener for Generate method button
document.getElementById("generateMethod").addEventListener("click", function () {
    //TODO: Need to save
    bkg.console.log("Getting Methods for display ");
})
