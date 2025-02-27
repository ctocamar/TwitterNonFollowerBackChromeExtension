/**
 * Checks the list of users and identifies those who don't follow back.
 * @param {string|null} cursor - The cursor for pagination.
 * @param {number} maxAttempts - Maximum attempts to fetch data.
 * @param {Object} variables - The query variables.
 * @param {Object} features - The GraphQL features.
 * @param {string} csrfToken - CSRF token for the request.
 * @param {string[]} notFollowing - List to store users who don't follow back.
 */
async function checkFollowing(cursor, maxAttempts, variables, features, csrfToken, notFollowing) {
  do {
    if (cursor) variables["cursor"] = cursor;

    const url = `https://x.com/i/api/graphql/o5eNLkJb03ayTQa97Cpp7w/Following?variables=${encodeURIComponent(
      JSON.stringify(variables)
    )}&features=${encodeURIComponent(JSON.stringify(features))}`;

    const headers = {
      Authorization:
        "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
      "x-csrf-token": csrfToken,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, { method: "GET", headers, credentials: "include" });
      const data = await response.json();
      const users = data.data.user.result.timeline.timeline.instructions.find(
        (instruction) => instruction.type === "TimelineAddEntries"
      )?.entries;

      users?.forEach((user) => {
        const profile = user.content.itemContent?.user_results.result;

        if (!profile) {
          if (user.content.cursorType === "Bottom") cursor = user.content.value;
          return;
        }

        if (!profile?.legacy?.followed_by) {
          notFollowing.push(`@${profile.legacy.screen_name}`);
        }
      });

    } catch (error) {
      console.error("Error fetching following data:", error);
    }
  } while (cursor && maxAttempts-- > 0);
}
