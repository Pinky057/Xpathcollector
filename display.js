// display.js

var bkg = chrome.extension.getBackgroundPage();
let listItemMap = {}; // Store references to list items
function handleCheckboxChange(event) {
    // Check if the checkbox is checked
    if (event.target.checked) {
        updateList(event.target.value, "checked")
        console.log(`Checkbox with value ${event.target.value} is checked.`);
    } else {
        console.log(`Checkbox with value ${event.target.value} is unchecked.`);
        updateList(event.target.value, "unchecked")
    }
}

function pageMethodSelected() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}

function updateList(item, status) {
    const list = document.getElementById("sortable");
    if (status === 'checked') {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
        listItemMap[item] = li;
        console.log("added", li);
    } else if (status === 'unchecked') {
        const li = listItemMap[item]; // Get the reference to the list item
        if (li) {
            list.removeChild(li);
            delete listItemMap[item]; // Remove the reference
            console.log("removed", li);
        }
    }
}

function resetInput() {
    var inputElement = document.getElementById("elementtestclick");
    // Reset the input value when the checkbox state changes
    if (inputElement) {
        inputElement.value = '';
    }
}
function updateInputValue() {
    var selectElement = document.getElementById("elementtestselect");
    var inputElement = document.getElementById("elementtestinput");

    console.log(" selectElement ", selectElement.value);
    if (selectElement && inputElement) {
        inputElement.value = selectElement.value;
    }
    console.log(" inputElement ", inputElement.value);
}

function updateSelectValue() {
    var selectElement = document.getElementById("elementtestselect");
    var inputElement = document.getElementById("elementtestinput");
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

addChangeInputListener("elementtestselect", "elementtestinput");
addChangeInputListener("elementtestselectclickall", "elementtestinputclickall");
addChangeInputListener("browserselecttabnav", "browserinputtabnav");
addChangeInputListener("browserselectfornavthkeypr", "browserinputfornavthkeypr");
addChangeInputListener("browserselectscrollmultipage", "browserinputscrollmultipage");
pageMethodSelected();

$(function () {
    $("#sortable").sortable();
});