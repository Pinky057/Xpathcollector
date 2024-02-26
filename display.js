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

window.onload = function() {
    // Get the element with class="defaultOpen" and click on it
    document.querySelector(".tablinks").click();
};


window.onload = function() {
    // Click on the first tab by default
    document.getElementById("tab1").click();

    // Add event listeners for all tab buttons:
    document.getElementById("tab1").addEventListener("click", function() {
        openTab('Tab1');
    });
    document.getElementById("tab2").addEventListener("click", function() {
        openTab('Tab2');
    });
    document.getElementById("tab3").addEventListener("click", function() {
        openTab('Tab3');
    });
};

//tab navigation
function openTab(tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all buttons with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i<tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab's content, and
    // add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    document.getElementById("tab" + tabName.charAt(3)).classList.add("active");
}
$(document).ready(function(){
    $("#Tab2").load("view.html");
    $("#workflow-content").load("workflow.html");
});

//save page level method to local storage
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('display-save-btn').addEventListener('click', function() {

        // Get input values
        var methodName = document.getElementById('method-name').value;
        var variables = document.getElementById('variables').value;
        var parameters = document.getElementById('parameters').value;
        var returnType = document.getElementById('return-type').value;

        // Form the data object
        var formData = {
            methodName: methodName,
            variables: variables,
            parameters: parameters,
            returnType: returnType
        };

        // Get existing data from LocalStorage and convert it to an array
        var existingData = JSON.parse(localStorage.getItem('formData_list')) || [];

        // Push new object into the existing array
        existingData.push(formData);

        // Save back to LocalStorage
        localStorage.setItem('formData_list', JSON.stringify(existingData));

        // Alert user of save
        alert('Data has been saved!');

        // Log saved data
        console.log('Saved data:', formData);
    });
});


// Fetch the stored data from LocalStorage
var storedData = JSON.parse(localStorage.getItem('formData_list')) || [];

// Get the list container
var listContainer = document.getElementById('form-data-list');

// For each object in storedData, create a list item and append it
storedData.forEach(function(formData) {
    var listItem = document.createElement('li');
    listItem.textContent = 'Method Name: ' + formData.methodName +
        ', Variables: ' + formData.variables +
        ', Parameters: ' + formData.parameters +
        ', Return Type: ' + formData.returnType;

    listContainer.appendChild(listItem);
});