var __toggled_on;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  if (request.is_toggled_on) {
    sendResponse({toggled_on: __toggled_on});
  }
});

var refresh_tab = function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {refresh: true});
  });
}

function toggle_on_off() {
  if (__toggled_on) {
    __toggled_on = false;
    chrome.browserAction.setIcon({path:"icon19_off.png"});
  } else {
    __toggled_on = true;
    chrome.browserAction.setIcon({path:"icon19.png"});
  }
  refresh_tab();
}

chrome.browserAction.onClicked.addListener(toggle_on_off);
toggle_on_off();

