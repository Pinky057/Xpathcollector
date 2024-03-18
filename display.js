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

function addMethodCheckboxListeners() {
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
//addMethodCheckboxListeners();

$(function () {
    $("#sortable").sortable();
});

$(function () {
    $("#sortable").sortable();
});

window.onload = function () {
    // Get the element with class="defaultOpen" and click on it
    document.querySelector(".tablinks").click();
};


window.onload = function () {
    // Click on the first tab by default
    document.getElementById("tab1").click();

    // Add event listeners for all tab buttons:
    document.getElementById("tab1").addEventListener("click", function () {
        openTab('Tab1');
    });
    document.getElementById("tab2").addEventListener("click", function () {
        openTab('Tab2');
    });
    // document.getElementById("tab3").addEventListener("click", function () {
    //     openTab('Tab3');
    // });
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
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab's content, and
    // add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    document.getElementById("tab" + tabName.charAt(3)).classList.add("active");
}
$(document).ready(function () {
    $("#Tab2").load("view.html", function () {
        createXPathListCardContainer();
    });
    $("#workflow-content").load("workflow.html");
});

//save page level method to local storage
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('display-save-btn').addEventListener('click', function () {

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


// Fetch the stored data from LocalStorage and show it to the workflow page
var storedData = JSON.parse(localStorage.getItem('formData_list')) || [];

// Get the list container
var listContainer = document.getElementById('form-data-list');

// For each object in storedData, create a list item and append it
storedData.forEach(function (formData) {
    var listItem = document.createElement('li');
    listItem.innerText = 'Method Name: ' + formData.methodName + '\n' +
        'Variables: ' + formData.variables + '\n' +
        'Parameters: ' + formData.parameters + '\n' +
        'Return Type: ' + formData.returnType;
        if (listContainer !== null) {
            listContainer.appendChild(listItem);
        } else {
            console.error("listContainer is null. Unable to append listItem.");
        }
    //listContainer.appendChild(listItem);
});

function createElementXPathListCard(title, xpaths) {
    var card = document.createElement('div');
    card.className = 'element-card';
    //console.log("createElementXPathListCard title", title, "xpaths", JSON.stringify(xpaths));
    var heading = document.createElement('h3');
    heading.textContent = title;
    var xpathList = document.createElement('ul');
    xpathList.className = 'selected-method-list';
    xpathList.style.listStyleType = 'disc';
    xpathList.style.maxWidth = '100%'; // Set a maximum width for the <ul> element
    xpathList.style.wordWrap = 'break-word'; // Fallback for older browsers

    for (var i = 0; i < xpaths.length; i++) {
        //console.log(" Xpath ", xpaths[i]);
        var listItem = document.createElement('li');
        listItem.textContent = xpaths[i];
        xpathList.appendChild(listItem);
    };

    card.appendChild(heading);
    card.appendChild(xpathList);

    return card;
}

// Function to create the card container and append cards to it
function createXPathListCardContainer() {
    var xpathlist = localStorage.getItem('panelDataList:');
    //console.log("createXPathListCardContainer displayXPathlist ", xpathlist);
    var container = document.getElementById("xpathcard");
    //container.className = 'card-container-view';
    container.className = 'card-container';
    var xpathListObj = JSON.parse(xpathlist);
    for (var i = 0; i < xpathListObj.length; i++) {
        var card = createElementXPathListCard(JSON.stringify(xpathListObj[i].elementName), xpathListObj[i].XPathList);
        container.appendChild(card);
    }

    return container;
}


// new refactored element method list card--------------------------------------------

function createFixedMethodCard(title) {
    var card = document.createElement('div');
    card.className = 'element-card';

    var heading = document.createElement('h3');
    heading.textContent = title;
    heading.style.cursor = 'pointer'; // give user feedback that heading is clickable

    var methodList = document.createElement('ul');
    methodList.className = 'selected-method-list';
    methodList.style.whiteSpace = 'break-spaces';
    methodList.style.overflowWrap = 'break-word';
    methodList.style.maxWidth = '100%';
    methodList.style.wordWrap = 'break-word';
    methodList.style.display = 'none'; // hide the list by default

    // Predefined methods
    var methods = ['presence of element', 'click on an element', 'right click on an element','find and click on element','keypress on element','multi click', 'visibility of element', 'element click', 'enter text'];

    for (var i = 0; i < methods.length; i++) {
        var listItem = document.createElement('li');

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = methods[i];
        checkbox.name = 'method';
        checkbox.value = methods[i];

        var label = document.createElement('label');
        label.htmlFor = methods[i];
        label.textContent = methods[i];

        listItem.appendChild(checkbox);
        listItem.appendChild(label);

        // Add nested inputs for specified methods
        if(['click on an element', 'right click on an element', 'find and click on element', 'keypress on element'].includes(methods[i])) {
            var details = document.createElement('details');
            var summary = document.createElement('summary');
            summary.textContent = " ";
            details.appendChild(summary);

            var optionList = document.createElement('ul');

            var nestedOption1 = document.createElement('li');
            var nestedInput1 = document.createElement('input');
            nestedInput1.type = 'text';
            nestedOption1.appendChild(nestedInput1);

            var nestedOption2 = document.createElement('li');
            var nestedInput2 = document.createElement('input');
            nestedInput2.type = 'text';
            nestedOption2.appendChild(nestedInput2);

            optionList.appendChild(nestedOption1);
            optionList.appendChild(nestedOption2);

            details.appendChild(optionList);

            listItem.appendChild(details);
        }

        methodList.appendChild(listItem);
    }

    heading.addEventListener('click', function() {
        // Toggle visibility of methodList when heading is clicked
        if (methodList.style.display === 'none') {
            methodList.style.display = 'block';
        } else {
            methodList.style.display = 'none';
        }
    });

    card.appendChild(heading);
    card.appendChild(methodList);

    return card;
}



function createFixedMethodCardContainer() {
    var xpathlist = localStorage.getItem('panelDataList:');
    var container = document.getElementById("method-card-container");
    container.className = 'card-container-view';

    var xpathListObj = JSON.parse(xpathlist);
    for (var i = 0; i < xpathListObj.length; i++) {
        var card = createFixedMethodCard(JSON.stringify(xpathListObj[i].elementName));
        container.appendChild(card);
    }

    return container;
}

createFixedMethodCardContainer();
addMethodCheckboxListeners();

// input element field values----------------------------------------------

function updateSelectionOptions(selectElementId) {
    var selectElement = document.getElementById(selectElementId);
    var titles = document.querySelectorAll(".element-card h3");

    // Clear existing options
    selectElement.innerHTML = "";

    titles.forEach(function(titleElement, index) {
        var option = document.createElement("option");
        option.value = "Element" + (index + 1);
        option.textContent = titleElement.textContent;
        selectElement.appendChild(option);
    });
}

// Call the function after the method cards have been generated

updateSelectionOptions("elementtestselect1");
updateSelectionOptions("elementtestselect2");
