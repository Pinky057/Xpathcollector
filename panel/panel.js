"use strict";
// variable be used for console log
var bkg = chrome.extension.getBackgroundPage();
bkg.console.log("Working on ", document.baseURI);
bkg.console.log("page on ", document);
var xpathList = [];
var elementObjectList = [];
var elementObjectMap = {};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  if (changeInfo.status === 'complete' && tab.active) {
    // Capture the URL
    var url = tab.url;
    bkg.console.log('Current URL:', url);

  }
});

chrome.runtime.onMessage.addListener((req, rec, res) => {
  document.querySelector(".toast").classList.add("d-hide");
  bkg.console.log("From message listener with request ", req.request);
  bkg.console.log("From message listener with request ", req);
  bkg.console.log('Current URLDDDDDD:', rec.tab.url);
  elementObjectMap = {};
  xpathList = [];
  elementObjectMap["elementName"] = req.methodname;
  elementObjectMap["PageURL"] = rec.tab.url;
  bkg.console.log("Sender tab id", rec.tab.id, " own tabID ", chrome.devtools.inspectedWindow.tabId);
  switch (req.request) {
    case "send_to_dev":
      buildUI(req);
      document
        .getElementById("cssbadge")
        .attributes.getNamedItem("data-badge").value = "0";
      if (req.cssPath.length > 0) {
        buildCSSUI(req);
      } else {
        jQuery("#cssbody").empty();
        let ui = `<div class="empty bg-dark">
          <p class="empty-title h5">Please select any element to get CSS/XPath</p>
          <p class="empty-subtitle">more new patterns coming soon :)</p>
          </div>`;
        jQuery("#cssbody").append(ui);
      }
      if (req.xpathid.length == 0) {
        jQuery("#addXPath").empty();
        let ui = `<div class="empty bg-dark">
          <p class="empty-title h5">Please select any element to get XPath/CSS</p>
          <p class="empty-subtitle">more new patterns coming soon :)</p>
          </div>`;
        jQuery("#addXPath").append(ui);
      }
      return true;
    case "anchor":
      document
        .getElementById("xpbadge")
        .attributes.getNamedItem("data-badge").value = 0;
      jQuery("#addXPath").empty();
      document
        .getElementById("cssbadge")
        .attributes.getNamedItem("data-badge").value = 0;
      jQuery("#cssbody").empty();
      let ui = `<div class="empty bg-dark">
          <p class="empty-title h5">Please select any element to get XPath/CSS</p>
          <p class="empty-subtitle">more new patterns coming soon :)</p>
          </div>`;
      jQuery("#addXPath").append(ui);
      jQuery("#cssbody").append(ui);
      generateAxes(req);
      return true;
    case "axes":
      $("#anxp").empty();
      $("#anxp").text(req.data);
      return true;
    case "fromUtilsSelector":
      utilsLocatorUI(req.data);
      return true;
    case "customSearchResult":
      buildSearchUI(req.data);
    case "activeDevTools":
      var answer = false;
      if (rec.tab.id == chrome.devtools.inspectedWindow.tabId) {
        answer = true;
      }
      const response = { reply: answer };
      bkg.console.log("Request tab ID ", rec.tab.id, " devtools/panel tab ID ", chrome.devtools.inspectedWindow.tabId, "replying  ", answer);
      res(response);
      return true;
    case "reset":
      if (rec.tab.id == chrome.devtools.inspectedWindow.tabId) {
        bkg.console.log("resetting the panel");
        resetVerificationMethods();
      }
    default:
      return true;
  }
});
let devtools_connections = chrome.runtime.connect({
  name: "ortoni_devtools_message",
});

function buildSearchUI(data) {
  jQuery("#insertsearch").empty();
  let ui = `<label for="count">${data.count}</label>
    <label for="xpath">${data.xpath}</label>`;
  $("#insertsearch").append(ui);
}

function utilsLocatorUI(data) {
  let len = data.length;
  if (len > 0) {
    let ui = `
      <table class="table">
        <thead>
          <th>Select</th>
          <th>Name</th>
          <th>XPath</th>
        </thead>
        <tbody>
          ${getTR()}
        </tbody>
      </table>`;
    $("#show").append(ui);
  }
  function getTR() {
    let tr = "";
    for (let i = 0; i < data.length; i++) {
      tr += `<tr><td><input class="checkbox" type="checkbox" name="locator" id="loc${i}"></td>
            <td>${data[i][1]}</td>
            <td>${data[i][2][0][2]}</td></tr>`;
    }
    return tr;
  }
}
// for the verification methods copy

// function to handle copy button click
function handleCopyButtonClick() {
  // Get all checked checkboxes
  var checkboxes = document.querySelectorAll('#checkboxForm input[type="checkbox"]:checked');

  // initialise an empty array to hold the names of checkboxes
  var selectedOptions = [];

  // loop through all selected(check) checkboxes
  for (var i = 0; i < checkboxes.length; i++) {
    // Get the checkbox's value
    var value = checkboxes[i].value;

    // Get corresponding textarea value
    //var textarea = checkboxes[i].parentNode.querySelector("textarea");

    var textarea = checkboxes[i].parentNode.querySelectorAll("textarea");
    //bkg.console.log("TEXTAREA ", textarea);
    for (var j = 0; j < textarea.length; j++) {
      value += "$$" + textarea[j].value;
      //bkg.console.log("MMMMMMMMM ", value); // Append textarea value to checkbox value
    }
    //bkg.console.log("DDDDDD ", value);
    // Push the value into the array
    selectedOptions.push(value);
    //bkg.console.log("aaaaaaaa ", JSON.stringify(selectedOptions));
  }

  var copiedText = JSON.stringify(selectedOptions);
  elementObjectMap["Methods"] = selectedOptions;
  //bkg.console.log("CCCCCCCC ", elementObjectMap);
  elementObjectList.push(elementObjectMap);
  //bkg.console.log("final  ", elementObjectList);
  localStorage.setItem("panelDataList:", JSON.stringify(elementObjectList));
  elementObjectMap = {};
  // create a temporary input field for copying the content to clipboard
  var tempInput = document.createElement("input");
  tempInput.value = copiedText;
  document.body.appendChild(tempInput);

  // select the content in the input field and copy it to the clipboard
  tempInput.select();
  document.execCommand("copy");

  // remove the temporary input field
  document.body.removeChild(tempInput);

  bkg.console.log("Copy to clipboard", copiedText);

  // alert the user that the contents were copied
  alert("Saved");
}

// function to handle save button click
function handleSaveButtonClick() {
  var checkedItems = Array.from(document.querySelectorAll("input[type=checkbox]:checked")).map((checkbox) => checkbox.value);
  localStorage.setItem("selectedItems", JSON.stringify(checkedItems));
  bkg.console.log("Saved to local storage", JSON.stringify(checkedItems));

}

// save button function  done

//called the save and copy function when the user clicks on the save and copy button

document.getElementById("saveAndCopyButton").addEventListener("click", function () {
  handleSaveButtonClick(); // comment out resetVerificationMethods() inside this function
  handleCopyButtonClick(); // comment out resetVerificationMethods() inside this function

  // After both the functions are executed, reset verification methods
  resetVerificationMethods();
});


function resetVerificationMethods() {
  // Get all checked checkboxes
  var checkboxes = document.querySelectorAll('#checkboxForm input[type="checkbox"]:checked');

  // loop through all selected(check) checkboxes
  for (var i = 0; i < checkboxes.length; i++) {
    // reset the checkbox's value
    checkboxes[i].checked = false;

    // Get corresponding textarea value
    var textarea = checkboxes[i].parentNode.querySelector("textarea");
    if (textarea && textarea.value) {
      //reset to default values
      textarea.value = "";
      textarea.placeholder = "Additional Information";
    }
  }
}

window.isDirty = function () {
  // Get all checked checkboxes
  var checkboxes = document.querySelectorAll('#checkboxForm input[type="checkbox"]:checked');
  return checkboxes.length > 0;
}

// generate axes based on user inputs
// we will need to remove this functions not for our project
function generateAxes(req) {
  // Bring the panel to active
  $("#tab_header li.tab-item").removeClass("active");
  $("#tab_header li.tab-item[data-option='3']").addClass("active");
  $("#tab_container .container_item").removeClass("active");
  $('div[data-item="3"]').addClass("active");
  jQuery("#anchorXPath").empty();
  let ui = `<div class="form-horizontal">
    <div class="form-group">
    <div class="col-12">
      <code class="form-label tooltip tooltip-bottom" id="anxp" data-copytarget="#anxp" data-tooltip="Click to copy" value="${req.data.proOrFol
    }">${req.data.defaultXPath}</code>
    </div>
    </div>
  </div>
    <div class="columns">
    <div class="column col-xs-6">
      <p class="chip bg-success">Parent Element</p>
      ${sourceElement(req.data.src)}
    </div>
    <div class="divider-vert" data-content="Axes"></div>
    <div class="column col-xs-6">
      <p class="chip bg-success">Child Element</p>
      ${targetElement(req.data.dst)}
    </div>
  </div>`;
  jQuery("#anchorXPath").append(ui);
}
// Build the source element
function sourceElement(element) {
  let ui = "";
  for (let i = 0; i < element.length; i++) {
    if (i == 0) {
      ui += `<div class="form-group has-info">
        <label class="form-switch">
          <input type="radio" name="src" value="${element[i][1]}" checked>
          <i class="form-icon"></i>${i + 1}. ${element[i][2]}
        </label>
      </div>`;
    } else {
      ui += `<div class="form-group">
        <label class="form-switch">
          <input type="radio" name="src" value="${element[i][1]}">
          <i class="form-icon"></i>${i + 1}. ${element[i][2]}
        </label>
      </div>`;
    }
  }
  return ui;
}
// Build the target element
function targetElement(element) {
  let ui = "";
  for (let i = 0; i < element.length; i++) {
    if (i == 0) {
      ui += `<div class="form-group">
        <label class="form-switch">
          <input type="radio" name="tgt" value="${element[i][1]}" checked>
          <i class="form-icon"></i>${i + 1}. ${element[i][2]}
        </label>
      </div>`;
    } else {
      ui += `<div class="form-group">
        <label class="form-switch">
          <input type="radio" name="tgt" value="${element[i][1]}">
          <i class="form-icon"></i>${i + 1}. ${element[i][2]}
        </label>
      </div>`;
    }
  }
  return ui;
}
// -------- based on the snippet type show the code ----------
function buildUI(data) {
  jQuery("#addXPath").empty();
  if (data.webtabledetails != null) {
    let table = `<div class="form-horizontal bg-dark">
      <span class="label label-rounded sm label-primary">Table Info - Total no.of table ${data.webtabledetails.totalTables}</span>
      <div class="form-group">
        <div class="col-11">
        <span class="label label-rounded label-success sm">Table unique locator</span>
          <code class="form-label" id="tablelocator">${data.webtabledetails.tableLocator}</code>
        </div>
        <div class="col-1 p-centered text-center">
          <button class="btn btn-link btn-sm tooltip tooltip-top" data-tooltip="Copy value" data-copytarget="#tablelocator">
            <img src="../assets/icons/copy.svg" alt="copy" data-copytarget="#tablelocator">
          </button>
        </div>
      </div>
      <div class="form-group">
        <div class="col-11">
          <span class="label label-rounded label-success sm">Locator for selected row</span>
          <code class="form-label" id="tabledata">${data.webtabledetails.tableData}</code>
        </div>
        <div class="col-1 p-centered text-center">
          <button class="btn btn-link btn-sm tooltip tooltip-top" data-tooltip="Copy value" id="copytd" data-copytarget="#tabledata">
            <img src="../assets/icons/copy.svg" alt="copy" data-copytarget="#tabledata"">
          </button>
        </div>
      </div>
    </div>`;
    jQuery("#addXPath").append(table);
  }
  let len = data.xpathid;
  document
    .getElementById("xpbadge")
    .attributes.getNamedItem("data-badge").value = len.length;
  for (let i = 0; i < len.length; i++) {
    generateXPathUI(data, i);
    xpathList.push(data.xpathid[i][1] + " = " + data.xpathid[i][2]);
  }
  bkg.console.log("WWWWWW ", xpathList);
  elementObjectMap["XPathList"] = xpathList;
}
// -------- Build XPath UI -------
function generateXPathUI(data, i) {
  let ui = `<div class="form-horizontal bg-dark">
    <span class="label label-success label-rounded sm">${i + 1}. ${data.xpathid[i][1]
    }</span>
    <div class="form-group">
      <div class="col-10 c-hand" id="xpathVal" data-copytarget="#xpath${i}">
        <code class="form-label tooltip tooltip-top" id="xpath${i}" data-copytarget="#xpath${i}" data-tooltip="Click to copy">${data.xpathid[i][2]
    }</code>
      </div>
      <div class="col-2 tooltip tooltip-top" data-tooltip="Copy Snippet">
      <div class="form-group bg-dark"><select class="form-select select-sm " id="snippetsSelector">${getSelectionValues(
      data,
      i,
      data.xpathid,
      false
    )}</select></div>
      </div>
    </div>
  </div>`;
  jQuery("#addXPath").append(ui);
}
// ------- build drop-down for snippet based on element type -------
function getSelectionValues(data, i, xp, isCSS) {
  let finalOP;
  let t = "";
  if (isCSS) {
    t = "CSS";
  } else {
    t = xp[i][1];
  }
  let type = data.type;
  let tag = data.tag;
  switch (tag) {
    case "textarea":
      finalOP = `<option value = "snippet" ct = "snip" cv = "snip" vn = "snip">Snippet</option>
        <option value="sendKeys" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">sendKeys</option>
        <option value="getAttribute" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">getAttribute</option>`;
      break;
    case "input":
      if (type === "submit" || type === "radio" || type === "checkbox") {
        finalOP = `<option value = "snippet" ct = "snip" cv = "snip" vn = "snip">Snippet</option>
          <option value="click" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">click</option>
          <option value="getAttribute" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">getAttribute</option>`;
      } else {
        finalOP = `<option value = "snippet" ct = "snip" cv = "snip" vn = "snip">Snippet</option>
          <option value="sendKeys" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">sendKeys</option>
          <option value="getAttribute" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">getAttribute</option>`;
      }
      break;
    case "img":
      finalOP = `<option value = "snippet" ct = "snip" cv = "snip" vn = "snip">Snippet</option>
        <option value="click" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">click</option>
        <option value="getAttribute" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">getAttribute</option>`;
      break;
    default:
      finalOP = `<option value = "snippet" ct = "snip" cv = "snip" vn = "snip">Snippet</option>
        <option value="click" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">click</option>
        <option value="getText" ct="${t}" cv="${xp[i][2]}" vn="${data.variablename}" mn="${data.methodname}">getText</option>`;
      break;
  }
  return finalOP;
}
function buildCSSUI(data) {
  document
    .getElementById("cssbadge")
    .attributes.getNamedItem("data-badge").value = data.cssPath.length;
  jQuery("#cssbody").empty();
  let ui = "";
  for (let i = 0; i < data.cssPath.length; i++) {
    ui += `<div class="form-horizontal">
      <span class="label label-rounded label-success sm">${i + 1}. ${data.cssPath[i][1]
      }</span>
        <div class="form-group">
          <div class="col-10 tooltip tooltip-top" id="xpathVal" data-tooltip="Click to copy" data-copytarget="#css${i}">
            <code class="form-label" id="css${i}" data-copytarget="#css${i}">${data.cssPath[i][2]
      }</code>
          </div>
          <div class="col-2 tooltip tooltip-top" data-tooltip="Copy Snippet">
            <select class="form-select select-sm" id="snippetsSelector">${getSelectionValues(
        data,
        i,
        data.cssPath,
        true
      )}</select>
          </div>
        </div>
      </div>`;
  }
  jQuery("#cssbody").append(ui);
}
