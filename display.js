// display.js

var bkg = chrome.extension.getBackgroundPage();
let listItemMap = new Map(); // Store references to list items
function handleCheckboxChange(event) {
  const checkbox = event.target;

  // Get the parent card and the title
  const card = checkbox.closest(".element-card");
  const heading = card ? card.querySelector("h3") : null;
  const title = heading ? heading.textContent.trim() : "";

  // Prepare the item string
  const item = title ? title + ": " + checkbox.value : checkbox.value;

  // Check if the checkbox is checked
  if (checkbox.checked) {

    resetSelectionOptions(
        "clickall",
        "elementtestselect1",
        "elementtestselect3",
        "elementtestselect1a"
    );

    updateIndMethods(
        item,
        "elementtestselect1",
        "elementtestselect3",
        "elementtestselect1a"
    );
    console.log(`Checkbox with value ${item} is checked.`);
  } else {
    removeAll(
        item,
        "elementtestselect1",
        "elementtestselect3",
        "elementtestselect1a"
    );
    console.log(`Checkbox with value ${item} is unchecked.`);
  }
}


function addMethodCheckboxListeners() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });
}

function updateList(item, status) {
  const list = document.getElementById("sortable");
  if (status === "checked") {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
    listItemMap[item] = li;
    console.log("added", li);
  } else if (status === "unchecked") {
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
    inputElement.value = "";
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
  document.addEventListener("DOMContentLoaded", function () {
    var selectElement = document.getElementById(selectID);
    var inputElement = document.getElementById(inputID);

    console.log(
      " inputElement ",
      inputElement,
      " selectElement ",
      selectElement
    );

    if (selectElement && inputElement) {
      selectElement.addEventListener("change", function () {
        inputElement.value = selectElement.value;
      });

      inputElement.addEventListener("input", function () {
        selectElement.value = inputElement.value;
      });
    }
  });
}

addChangeInputListener("elementtestselect", "elementtestinput");
addChangeInputListener("elementtestselectclickall", "elementtestinputclickall");
addChangeInputListener("browserselecttabnav", "browserinputtabnav");
addChangeInputListener(
  "browserselectfornavthkeypr",
  "browserinputfornavthkeypr"
);
addChangeInputListener(
  "browserselectscrollmultipage",
  "browserinputscrollmultipage"
);

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
    openTab("Tab1");
  });
  document.getElementById("tab2").addEventListener("click", function () {
    openTab("Tab2");
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

// page title save -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", (event) => {
  var titleInput = document.getElementById("title-input");

  // if there is a saved title, use it and disable the input
  var savedTitle = localStorage.getItem("pageTitle");
  if (savedTitle) {
    titleInput.value = savedTitle;
    titleInput.disabled = true;
  } else {
    titleInput.addEventListener('blur', function () {
      // When focus is lost, save the title and disable the input
      localStorage.setItem("pageTitle", titleInput.value);
      titleInput.disabled = true;
    });
  }
});



//save page level method to local storage and also added the validation the methodName input field
document.addEventListener("DOMContentLoaded", (event) => {
  var saveButton = document.getElementById("display-save-btn");
  var methodNameInput = document.getElementById("method-name");

  // Initially disable the save button
  saveButton.disabled = true;

  methodNameInput.addEventListener('input', function () {
    // If the methodName field is empty then disable the button, else enable it
    saveButton.disabled = !methodNameInput.value;
  });

  saveButton.addEventListener("click", function () {
    // Get input values
    var methodName = methodNameInput.value;
    var variables = document.getElementById("variables").value;
    var parameters = document.getElementById("parameters").value;
    var returnType = document.getElementById("return-type").value;

      // Form the data object
      var formData = {
        methodName: methodName,
        variables: variables,
        parameters: parameters,
        returnType: returnType,
      };

      // Get existing data from LocalStorage and convert it to an array
      var existingData =
        JSON.parse(localStorage.getItem("formData_list")) || [];

      // Push new object into the existing array
      existingData.push(formData);

      // Save back to LocalStorage
      localStorage.setItem("formData_list", JSON.stringify(existingData));

      // Alert user of save
      alert("Data has been saved!");

      // Log saved data
      console.log("Saved data:", formData);
    });


  // Reset function - customize this to suit your needs
  function resetFunction() {
    // Reset form inputs
    var inputs = document.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }

    // Reset the sortable list
    const list = document.getElementById("sortable");
    list.innerHTML = '';

    // If you stored some variable in localStorage that needs to be reset, you can do:
    // localStorage.removeItem("variableName");
  }


  // update page level method to local storage

  document.getElementById("update-btn").addEventListener("click", function () {
    // Get sortable list items
    const list = document.getElementById("sortable");
    const listItems = Array.from(list.getElementsByTagName("li"));
    var methodList = listItems.map((li) => li.textContent);

    // Get existing data from LocalStorage and convert it to an array
    var existingData = JSON.parse(localStorage.getItem("formData_list"));
    if (!existingData || !existingData.length) {
      console.warn("No saved data to update!");
      return;
    }

    // Update the last saved data with sortable list items
    const lastSavedData = existingData[existingData.length - 1];
    lastSavedData.methodList = methodList;

    // Save back to LocalStorage
    localStorage.setItem("formData_list", JSON.stringify(existingData));

    // Alert user of update
    alert("Data has been updated!");

    // Log updated data
    console.log("Updated data:", existingData);
    resetFunction();

  });
});
// Fetch the stored data from LocalStorage and show it to the workflow page

// reset function
let storedData = JSON.parse(localStorage.getItem("formData_list")) || [];

// Get the list container
var listContainer = document.getElementById("form-data-list");

// For each object in storedData, create a list item and append it
storedData.forEach(function (formData) {
  var listItem = document.createElement("li");
  listItem.innerText =
    "Method Name: " +
    formData.methodName +
    "\n" +
    "Variables: " +
    formData.variables +
    "\n" +
    "Parameters: " +
    formData.parameters +
    "\n" +
    "Return Type: " +
    formData.returnType;
  if (listContainer !== null) {
    listContainer.appendChild(listItem);
  } else {
    console.error("listContainer is null. Unable to append listItem.");
  }
  //listContainer.appendChild(listItem);
});

// Xpath list card--------------------------------------------

function createElementXPathListCard(title, xpaths) {
  var card = document.createElement("div");
  card.className = "element-card";

  // Add styles directly to the card
  card.style.margin = "0 10px 10px 0"; // Add some margins
  card.style.flex = "1"; // Allow cards to grow and shrink
  card.style.flexBasis = "calc(50% - 10px)"; // Set base size to 50% minus margin

  var heading = document.createElement("h3");
  heading.textContent = title;

  var xpathList = document.createElement("ul");
  xpathList.className = "selected-method-list";
  xpathList.style.listStyleType = "none";
  xpathList.style.maxWidth = "100%";
  xpathList.style.wordWrap = "break-word";

  for (var i = 0; i < xpaths.length; i++) {
    var listItem = document.createElement("li");
    listItem.textContent = xpaths[i];
    xpathList.appendChild(listItem);
  }

  card.appendChild(heading);
  card.appendChild(xpathList);
  return card;
}

function createXPathListCardContainer() {
  var xpathlist = localStorage.getItem("panelDataList:");
  var container = document.getElementById("xpathcard");
  var cardContainer = document.createElement("div");
  cardContainer.className = "card-container";
  cardContainer.style.display = "flex"; // Set container to be a flex container
  cardContainer.style.flexWrap = "wrap"; // Allows the items to wrap as needed
  var xpathListObj = JSON.parse(xpathlist);

  // Append the cards to the cardContainer.
  for (var i = 0; i < xpathListObj.length; i++) {
    var card = createElementXPathListCard(
      JSON.stringify(xpathListObj[i].elementName),
      xpathListObj[i].XPathList
    );
    cardContainer.appendChild(card);
  }

  // Append the card container to the main container.
  container.appendChild(cardContainer);
  return container;
}

// new refactored element method list card--------------------------------------------
function createFixedMethodCard(title) {
  var card = document.createElement("div");
  card.className = "element-card";

  var heading = document.createElement("h3");
  heading.textContent = title;
  heading.style.cursor = "pointer";

  var methodList = document.createElement("ul");
  methodList.className = "selected-method-list";
  methodList.style.whiteSpace = "break-spaces";
  methodList.style.overflowWrap = "break-word";
  methodList.style.maxWidth = "100%";
  methodList.style.wordWrap = "break-word";
  methodList.style.display = "none";

  var methods = [
    "presence of element",
    "click on an element",
    "right click on an element",
    "find and click on element",
    "keypress on element",
    "multi click",
    "visibility of element",
    "element click",
    "enter text",
  ];
  var dropdownOptions = ["return", "tab", "up", "down", "left", "right"];

  for (var i = 0; i < methods.length; i++) {
    var listItem = document.createElement("li");

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = methods[i];
    checkbox.name = "method";
    checkbox.value = methods[i];

    var label = document.createElement("label");
    label.htmlFor = methods[i];
    label.textContent = methods[i];

    listItem.appendChild(checkbox);
    listItem.appendChild(label);

    // Add dropdown for 'keypress on element' method with specified options
    if (methods[i] === "keypress on element") {
      var dropdown = document.createElement("select");

      //Apply styles to dropdown
      dropdown.style.width = "200px";
      dropdown.style.padding = "5px";
      dropdown.style.fontSize = "14px";
      dropdown.style.marginTop = "10px";
      dropdown.style.borderRadius = "5px";

      dropdownOptions.forEach(function (optionValue) {
        var option = document.createElement("option");
        option.value = optionValue;
        option.text = optionValue;
        dropdown.appendChild(option);
      });

      listItem.appendChild(dropdown);
    }

    methodList.appendChild(listItem);
  }

  heading.addEventListener("click", function () {
    if (methodList.style.display === "none") {
      methodList.style.display = "block";
    } else {
      methodList.style.display = "none";
    }
  });

  card.appendChild(heading);
  card.appendChild(methodList);

  return card;
}

function createFixedMethodCardContainer() {
  var xpathlist = localStorage.getItem("panelDataList:");
  var container = document.getElementById("method-card-container");
  container.className = "card-container-view";

  var xpathListObj = JSON.parse(xpathlist);
  for (var i = 0; i < xpathListObj.length; i++) {
    var card = createFixedMethodCard(
      JSON.stringify(xpathListObj[i].elementName)
    );
    container.appendChild(card);
  }

  return container;
}

createFixedMethodCardContainer();
addMethodCheckboxListeners();

// input element field values----------------------------------------------

function updateElemntSelectionOptions(selectElementId) {
  var selectElement = document.getElementById(selectElementId);
  var titles = document.querySelectorAll(".element-card h3");

  // Clear existing options
  selectElement.innerHTML = "";

  titles.forEach(function (titleElement, index) {
    var option = document.createElement("option");
    option.value = "Element" + (index + 1);
    option.textContent = titleElement.textContent;
    selectElement.appendChild(option);
  });
}

// Call the function after the method cards have been generated---------------------

// updateElemntSelectionOptions("elementtestselect1");
updateElemntSelectionOptions("elementtestselect2");
// updateElemntSelectionOptions("elementtestselect3");
updateElemntSelectionOptions("elementtestselect4");
updateElemntSelectionOptions("elementtestselectType");
updateElemntSelectionOptions("elementtestselectText");
updateElemntSelectionOptions("elemntsClickIf");
updateElemntSelectionOptions("elementtestselectdismissprompt");

// input page level method field values----------------------------------------------

// Gets JSON-formatted data from local storage
// merging two methods

storedData = JSON.parse(localStorage.getItem('formData_list')) || [];

const dropdownOptions = [
  "scroll up slow",
  "scroll down slow",
  "scroll down fast",
  "quick wait",
  "small wait",
  "med wait",
  "long wait",
  "quickest wait",
  "dismiss prompt",
  "conditional click",
  "type",
  "conditional enter text",
  "multi click",
  "scroll multi page",
  "select all text in screen",
  "forward navigation through key press",
  "tab navigation",
  "do ocr",
  "do image comparison",
  "find element",
  "scroll up fast",
  "key down key press",
  "select from list",
  "click all",
  "else block",
  "end of block",
  "scroll to element",
  "multi call",
  "click by",
  "click if"
];

function populateDropdownWithStoredData(selectElementId, fieldName = null, options = storedData) {
  var selectElement = document.getElementById(selectElementId);

  // Clear existing options
  selectElement.innerHTML = '';

  // Create a default 'Select..' option and append it to the select
  var defaultOption = document.createElement('option');
  defaultOption.text = 'Select...';
  defaultOption.value = '';
  selectElement.appendChild(defaultOption);

  // Add options to the selectElement
  options.forEach(function(item) {
    var option = document.createElement('option');
    option.value = fieldName ? item[fieldName] : item;
    option.textContent = fieldName ? item[fieldName] : item;
    selectElement.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', function () {

  // Wait for the DOM to load, then populate the dropdown
  populateDropdownWithStoredData("methodselectmulticall", "methodName");
  populateDropdownWithStoredData("perameterselectmulticall", "parameters");
  populateDropdownWithStoredData("methodselect1", "methodName");
  populateDropdownWithStoredData("perameterselect1", "parameters");
  populateDropdownWithStoredData("variableselect1", "variables");
  populateDropdownWithStoredData("perameterselectType", "parameters");
  populateDropdownWithStoredData("variableselectType", "variables");
  populateDropdownWithStoredData("perameterselectText", "parameters");
  populateDropdownWithStoredData("variableselectText", "variables");
  populateDropdownWithStoredData("perameterselectClick", "parameters");
  populateDropdownWithStoredData(
      "parametertestselectImageComparison",
      "parameters"
  );
  populateDropdownWithStoredData(
      "methodtestselectImageComparison",
      "methodName"
  );
  populateDropdownWithStoredData("variableselectFormList", "variables");
  // populateDropdownWithStoredData("methodtselectClickBy", "methodName");
  populateDropdownWithStoredData("perameterselectClickBy", "parameters");
  populateDropdownWithStoredData("variableselectClickBy", "variables");
  // populateDropdownWithStoredData("methodtselectClickif" , "methodName");
  populateDropdownWithStoredData("perameterselectClickif", "parameters");
  populateDropdownWithStoredData("pagemethodsClickif", "methodName");

  // Populate dropdowns with dropdownOptions
  populateDropdownWithStoredData('methodtselectClickBy', null, dropdownOptions);
  populateDropdownWithStoredData('methodtselectClickif', null, dropdownOptions);
});





// validations for input fields ----------------------------------------------
document.addEventListener("DOMContentLoaded", function () {

  // Your existing code...
//for clickby
  var parameterSelect = document.getElementById('perameterselectClickBy');
  var variableSelect = document.getElementById('variableselectClickBy');

  parameterSelect.addEventListener('change', function() {
    // disable variable select if parameter is selected
    variableSelect.disabled = !!this.value;
  });

  variableSelect.addEventListener('change', function() {
    //disable parameter select if variable is selected
    parameterSelect.disabled = !!this.value;
  });

  //for clickif

  var methodSelectClickIf = document.getElementById('methodtselectClickif');
  var parameterSelectClickIf = document.getElementById('perameterselectClickif');
  var pageMethodsClickIf = document.getElementById('pagemethodsClickif');

  methodSelectClickIf.addEventListener('change', function() {
    // enable parameter select if method is selected, otherwise disable
    parameterSelectClickIf.disabled = !this.value;
    // enable pageMethods select if method is not selected, otherwise disable
    pageMethodsClickIf.disabled = !!this.value;
  });

  pageMethodsClickIf.addEventListener('change', function() {
    // if pageMethods is selected, disable method and parameter selects
    if (this.value) {
      methodSelectClickIf.disabled = true;
      parameterSelectClickIf.disabled = true;
    }
    // if pageMethods is not selected, enable method and parameter selects
    else {
      methodSelectClickIf.disabled = false;
      parameterSelectClickIf.disabled = false;
    }
  });


  // Add validation for any other select pairs in the same manner...
});


// need to moved utils js
$(document).ready(function(){
  $('input[type="checkbox"]').click(function(){
    $(this).next().animate({
      'max-height' : this.checked ? '100vh' : '0'
    }, 500);
  });
});



// new changes for click all


// input element field values----------------------------------------------
function resetSelectionOptions(key, id1, id2, id3) {
  const selectElement1 = document.getElementById(id1);
  if (selectElement1 !== null) {
    selectElement1.selectedIndex = -1; // Unselect any currently selected option
  }
  const selectElement2 = document.getElementById(id2);
  if (selectElement2 !== null) {
    selectElement2.selectedIndex = -1; // Unselect any currently selected option
  }
  const selectElement3 = document.getElementById(id3);
  if (selectElement3 !== null) {
    selectElement3.selectedIndex = -1; // Unselect any currently selected option
  }
}

function updateSelectionOptions(key, id1, id2, id3) {
  //var status = false;

  newFunction(id1, false);
  newFunction(id2, true);
  newFunctionTF(id3);

  function newFunction(currentId, dummy) {
    const selectElement = document.getElementById(currentId);
    console.log("selectelement: ", selectElement);
    var titles = document.querySelectorAll(".element-card h3");
    console.log("Title: ", titles);
    // Clear existing options
    selectElement.innerHTML = "";
    if (dummy) {
      var option = document.createElement("option");
      option.value = "";
      option.disabled = true; // Disable the option
      option.selected = true; // Select the option by default
      option.textContent = "";
      console.log("Adding dummy option: ", option);
      selectElement.appendChild(option);
    }
    titles.forEach(function (titleElement, index) {
      var option = document.createElement("option");
      option.value = "Element" + (index + 1);
      option.textContent = titleElement.textContent;
      console.log("option: ", option.textContent);
      selectElement.appendChild(option);
    });
    selectElement.addEventListener("change", function () {
      updateIndMethods(key, id1, id2, id3);
    });
  }
  function newFunctionTF(currentId) {
    console.log("Called newFunctionTF", currentId);
    var selectElement = document.createElement("select");
    selectElement.id = currentId;

    console.log("selectelementTF: ", selectElement);
    var titles = ["True", "False"];
    selectElement.innerHTML = "";
    var option = document.createElement("option");
    option.value = "";
    option.disabled = true; // Disable the option
    option.selected = true; // Select the option by default
    option.textContent = "";
    console.log("Adding dummy option: ", option);
    selectElement.appendChild(option);

    titles.forEach(function (titleElement, index) {
      var option = document.createElement("option");
      option.value = "Element" + (index + 1);
      option.textContent = titleElement;
      console.log("option element: ", option);
      selectElement.appendChild(option);
    });
    var division = document.getElementById("clickalldiv");
    division.appendChild(selectElement);
    selectElement.addEventListener("change", function () {
      updateIndMethods(key, id1, id2, id3);
    });
  }
}

updateSelectionOptions(
    "clickall",
    "elementtestselect1",
    "elementtestselect3",
    "elementtestselect1a"
);
updateSelectionOptions("scrolltoelement", "elementtestselectScroolElement");
// updateSelectionOptions("conditionalClick", "elementtestselectConditionalclick");
// updateSelectionOptions("type", "elementtestselectType");

function updateIndMethods(key, id1, id2, id3) {
  removeAll(key, id1, id2, id3);
  addAll(key, id1, id2, id3);
}

function removeAll(key, id1, id2, id3) {
  if (listItemMap.has(key)) {
    var list = listItemMap.get(key);
    console.log("Values for key '" + key + "':");
    for (var i = 0; i < list.length; i++) {
      document.getElementById("sortable").removeChild(list[i]);
      console.log("removed: ", list[i]);
    }
    listItemMap.delete(key);
  } else {
    console.log("Key '" + key + "' not found in the Map.");
  }
}

function addAll(key, id1, id2, id3) {
  console.log("addAll ", key, id1);
  const list = document.getElementById("sortable");
  listItemMap.set(key, []);

  const li = document.createElement("li");
  li.textContent = key;
  list.appendChild(li);
  listItemMap.get(key).push(li);

  newFunction(id1);
  newFunction(id2);
  newFunction(id3);

  function newFunction(currentId) {
    var ele1 = document.getElementById(currentId);
    console.log("ele1.selectedOptions:", ele1.selectedOptions);
    var selectedOptions1 = Array.from(ele1.selectedOptions).map(
        (option) => option.textContent
    );
    for (var i = 0; i < selectedOptions1.length; i++) {
      console.log("selectedOptions1[i] ", selectedOptions1[i]);
      const liId1 = document.createElement("li");
      liId1.textContent = selectedOptions1[i];
      list.appendChild(liId1);
      listItemMap.get(key).push(liId1);
    }
  }
}
