document.addEventListener('DOMContentLoaded', function () {
    let userResponse = confirm('Page has reloaded! Do you want to go to the display page?');
    if (userResponse) {
        window.open(chrome.runtime.getURL('display.html'), '_blank');
    }
});