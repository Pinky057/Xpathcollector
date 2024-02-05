// display.js

var bkg = chrome.extension.getBackgroundPage();

//window.onload = function () {
//   var savedItems = JSON.parse(localStorage.getItem("selectedItems"));
//   var displayElement = document.getElementById("display");
//   displayElement.innerHTML = savedItems ? savedItems.join(", ") : "No items have been saved.";

//     var dynGridElement = document.getElementById("dynamic_grid");
//     var tmpHtml = "";
//     for (var i = 0; i < 3; i++) {
//         tmpHtml += "<div class=\"grid-container>div\">ElementX</div>";
//     }
//     //dynGridElement.innerHTML = tmpHtml;
//     //dynGridElement.innerHTML = "<div class=\"item6\">Element1</div> <div class=\"item7\">Element2</div> <div class=\"item8\">Element3</div><div class=\"item9\">Element4</div>"
//     console.log("AAAAAAAA ", dynGridElement.innerHTML);
// }

// // Listener for Generate method button
// document.getElementById("generateMethod").addEventListener("click", function () {
//     //TODO: Need to save
//     bkg.console.log("Getting Methods for display ");
// })

function resetInput() {
    var inputElement = document.getElementById("elementTESTClick");
    // Reset the input value when the checkbox state changes
    if (inputElement) {
        inputElement.value = '';
    }
}
function updateInputValue() {
    var selectElement = document.getElementById("elementTESTSelect");
    var inputElement = document.getElementById("elementTESTInput");

    console.log(" selectElement ", selectElement.value);
    if (selectElement && inputElement) {
        inputElement.value = selectElement.value;
    }
    console.log(" inputElement ", inputElement.value);
}

function updateSelectValue() {
    var selectElement = document.getElementById("elementTESTSelect");
    var inputElement = document.getElementById("elementTESTInput");
    if (selectElement && inputElement) {
        selectElement.value = inputElement.value;
    }
}


function addChangeInputListener(selectID, inputID) {

    document.addEventListener('DOMContentLoaded', function () {
        var selectElement = document.getElementById(selectID);
        var inputElement = document.getElementById(inputID);

        console.log(" inputElement ", inputElement, " selectElement ", selectElement);

        if (selectElement && inputElement) {
            selectElement.addEventListener('change', function () {
                inputElement.value = selectElement.value;
            });

            inputElement.addEventListener('input', function () {
                selectElement.value = inputElement.value;
            });
        }

    });
}

addChangeInputListener("elementTESTSelect", "elementTESTInput");
addChangeInputListener("elementTESTSelectClickAll", "elementTESTInputClickAll");
addChangeInputListener("browserSelectTabNav", "browserInputTabNav");
addChangeInputListener("browserSelectForNavThKeyPr", "browserInputForNavThKeyPr");
addChangeInputListener("browserSelectScrollMultiPage", "browserInputScrollMultiPage");