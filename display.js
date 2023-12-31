// display.js

window.onload = function() {
    var savedItems = JSON.parse(localStorage.getItem("selectedItems"));
    var displayElement = document.getElementById("display");
    displayElement.innerHTML = savedItems ? savedItems.join(", ") : "No items have been saved.";
}