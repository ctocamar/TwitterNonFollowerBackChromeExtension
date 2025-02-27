chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message !== "clicked_browser_action") return;

  showActionButtons();
    
});
