async function showNotFollowerBack() {

	const userId = extractUserId();
	  if (!userId) {
	    console.error("User ID not found.");
	    throw new Error("User ID retrieval failed.");
	  }
	  const url = 'https://x.com/i/api/graphql/o5eNLkJb03ayTQa97Cpp7w/Following';
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

	  await fetchUsers(cursor, variables, features, csrfToken, notFollowing, maxAttempts, url);

	  hideSpinner();

	  displayResults(notFollowing, "Users who don't follow you back");

}

async function showNotFollowingBack() {

	const userId = extractUserId();
	  if (!userId) {
	    console.error("User ID not found.");
	    throw new Error("User ID retrieval failed.");
	  }
	  const url = 'https://x.com/i/api/graphql/OGScL-RC4DFMsRGOCjPR6g/Followers';
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

	  await fetchUsers(cursor, variables, features, csrfToken, notFollowing, maxAttempts, url);

	  hideSpinner();

	  displayResults(notFollowing, "Users who you don't follow back");

}