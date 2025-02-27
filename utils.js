function getFeatures() {
  return {
    profile_label_improvements_pcf_label_in_post_enabled: true,
    rweb_tipjar_consumption_enabled: true,
    responsive_web_graphql_exclude_directive_enabled: true,
    verified_phone_label_enabled: false,
    creator_subscriptions_tweet_preview_api_enabled: true,
    responsive_web_graphql_timeline_navigation_enabled: true,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    premium_content_api_read_enabled: false,
    communities_web_enable_tweet_community_results_fetch: true,
    c9s_tweet_anatomy_moderator_badge_enabled: true,
    responsive_web_grok_analyze_button_fetch_trends_enabled: false,
    responsive_web_grok_analyze_post_followups_enabled: true,
    responsive_web_jetfuel_frame: false,
    responsive_web_grok_share_attachment_enabled: true,
    articles_preview_enabled: true,
    responsive_web_edit_tweet_api_enabled: true,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
    view_counts_everywhere_api_enabled: true,
    longform_notetweets_consumption_enabled: true,
    responsive_web_twitter_article_tweet_consumption_enabled: true,
    tweet_awards_web_tipping_enabled: false,
    responsive_web_grok_analysis_button_from_backend: false,
    creator_subscriptions_quote_tweet_preview_enabled: false,
    freedom_of_speech_not_reach_fetch_enabled: true,
    standardized_nudges_misinfo: true,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
    rweb_video_timestamps_enabled: true,
    longform_notetweets_rich_text_read_enabled: true,
    longform_notetweets_inline_media_enabled: true,
    responsive_web_grok_image_annotation_enabled: false,
    responsive_web_enhance_cards_enabled: false,
  };
}

async function fetchUsers(cursor, variables, features, csrfToken, notFollowing, maxAttempts, url) {
  do {
    if (cursor) variables["cursor"] = cursor;

    const followingUrl = createUrl(url, variables, features);

    const headers = createHeaders(csrfToken);

    try {
      const followingResponse = await fetch(followingUrl, { method: "GET", headers, credentials: "include" });
      const followingData = await followingResponse.json();
      const followingUsers = getUsersFromData(followingData);


      followingUsers.forEach((user) => {
        const profile = user.content.itemContent?.user_results.result;

        if (!profile) {
          if (user.content.cursorType === "Bottom") cursor = user.content.value;
          return;
        }
        if(url.includes('Following')){
          if (!profile?.legacy?.followed_by) {
            notFollowing.push(`@${profile.legacy.screen_name}`);
          }
        }else if (url.includes('Followers')){
          if (!profile?.legacy?.following) {
            notFollowing.push(`@${profile.legacy.screen_name}`);
          }
        }

      });
    } catch (error) {
      console.error("Request error:", error);
    }
  } while (cursor && !cursor.startsWith("0|") && maxAttempts-- > 0);
}

function createUrl(url, variables, features) {
  return `${url}?variables=${encodeURIComponent(
    JSON.stringify(variables)
  )}&features=${encodeURIComponent(JSON.stringify(features))}`;
}


function createHeaders(csrfToken) {
  return {
    Authorization: "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
    "x-csrf-token": csrfToken,
    "Content-Type": "application/json",
  };
}

function getUsersFromData(data) {
  return data.data.user.result.timeline.timeline.instructions.find(
    (instruction) => instruction.type === "TimelineAddEntries"
  )?.entries || [];
}

function extractUserId() {
  const match = document.documentElement.innerHTML.match(/"id_str"\s*:\s*"(\d+)"/);
  return match ? match[1] : null;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}
