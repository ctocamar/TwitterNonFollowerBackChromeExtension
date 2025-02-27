chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message !== "clicked_browser_action") return;

  const userId = extractUserId();
  if (!userId) {
    console.error("User ID not found.");
    throw new Error("User ID retrieval failed.");
  }

  const variables = {
    userId,
    count: 20,
    includePromotedContent: false,
  };

  const features = getFeatures();

  const csrfToken = getCookie("ct0");
  let notFollowing = [];

  showSpinner();

  let cursor = null;
  const maxAttempts = 20;

  await fetchUsers(cursor, variables, features, csrfToken, notFollowing, maxAttempts);

  hideSpinner();

  displayResults(notFollowing);
});
