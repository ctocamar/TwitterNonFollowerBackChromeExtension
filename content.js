chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {

      let cursor = null;
      let maxAttempts = 20;
      let userId = null;
      const html = document.documentElement.innerHTML;
      const userIdContainer = html.match(/"id_str"\s*:\s*"(\d+)"/);
      if (userIdContainer && userIdContainer[1]) {
        userId = userIdContainer[1];
      } else {
        console.log('No se encontró window.__INITIAL_STATE__');
      }

      if(userId === null){
        throw new Error("friki");
      }
      let variables = {
        "userId": userId,
        "count" : 20,
        "includePromotedContent": false
      }

      const features = {
        "profile_label_improvements_pcf_label_in_post_enabled": true,
        "rweb_tipjar_consumption_enabled": true,
        "responsive_web_graphql_exclude_directive_enabled": true,
        "verified_phone_label_enabled": false,
        "creator_subscriptions_tweet_preview_api_enabled": true,
        "responsive_web_graphql_timeline_navigation_enabled": true,
        "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
        "premium_content_api_read_enabled": false,
        "communities_web_enable_tweet_community_results_fetch": true,
        "c9s_tweet_anatomy_moderator_badge_enabled": true,
        "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
        "responsive_web_grok_analyze_post_followups_enabled": true,
        "responsive_web_jetfuel_frame": false,
        "responsive_web_grok_share_attachment_enabled": true,
        "articles_preview_enabled": true,
        "responsive_web_edit_tweet_api_enabled": true,
        "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
        "view_counts_everywhere_api_enabled": true,
        "longform_notetweets_consumption_enabled": true,
        "responsive_web_twitter_article_tweet_consumption_enabled": true,
        "tweet_awards_web_tipping_enabled": false,
        "responsive_web_grok_analysis_button_from_backend": false,
        "creator_subscriptions_quote_tweet_preview_enabled": false,
        "freedom_of_speech_not_reach_fetch_enabled": true,
        "standardized_nudges_misinfo": true,
        "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
        "rweb_video_timestamps_enabled": true,
        "longform_notetweets_rich_text_read_enabled": true,
        "longform_notetweets_inline_media_enabled": true,
        "responsive_web_grok_image_annotation_enabled": false,
        "responsive_web_enhance_cards_enabled": false
      };

      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      const csrfToken = getCookie('ct0');

      // Array para almacenar los usuarios que no te siguen
      let notFollowing = [];

      // Crear el spinner con estilo actualizado
      let spinner = document.createElement("div");
      spinner.style.position = "fixed";
      spinner.style.top = "50%";
      spinner.style.left = "50%";
      spinner.style.transform = "translate(-50%, -50%)";
      spinner.style.width = "60px";
      spinner.style.height = "60px";
      spinner.style.border = "8px solid transparent";
      spinner.style.borderTop = "8px solid #ff5722";
      spinner.style.borderRadius = "50%";
      spinner.style.animation = "spin 1.5s linear infinite";
      spinner.style.zIndex = "10000";
      document.body.appendChild(spinner);

      // Definir la animación de giro para el spinner
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      do {
        if (cursor !== null) {
          variables["cursor"] = cursor;
        }

        const url = `https://x.com/i/api/graphql/o5eNLkJb03ayTQa97Cpp7w/Following?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;

        const headers = {
          "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
          "x-csrf-token": csrfToken,
          "Content-Type": "application/json"
        };

        try {
          const response = await fetch(url, { method: "GET", headers, credentials: "include" });
          const data = await response.json();

          const users = data.data.user.result.timeline.timeline.instructions.find(instruction => instruction.type === "TimelineAddEntries")?.entries;
          
          users.forEach(function(user) {
            const profile = user.content.itemContent?.user_results.result;

            if (profile === undefined) {
              if (user.content.cursorType === "Bottom") {
                cursor = user.content.value;
              }
              return;
            }

            if (profile?.legacy?.followed_by === true) {
              // Si te sigue, no hacer nada
            } else {
              // Almacenar el usuario que no te sigue
              notFollowing.push("@"+profile.legacy.screen_name);
            }
          });
          
        } catch (error) {
          console.error("Error en la petición:", error);
        }
      } while(cursor && !cursor.startsWith("0|") && maxAttempts-- > 0)

      // Eliminar el spinner
      document.body.removeChild(spinner);

      if (notFollowing.length > 0) {
        // Crear el contenedor principal del popup
        let popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.backgroundColor = "#1e1e1e";
        popup.style.color = "#fff";
        popup.style.padding = "20px 30px";
        popup.style.borderRadius = "12px";
        popup.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
        popup.style.zIndex = "10000";
        popup.style.maxHeight = "80vh";
        popup.style.overflowY = "auto";
        popup.style.width = "90%";
        popup.style.maxWidth = "600px";
        popup.style.fontFamily = "'Roboto', sans-serif";
        popup.style.transition = "transform 0.3s ease-in-out";

        // Título del popup
        let title = document.createElement("h2");
        title.textContent = "Users that doesn't follow you back";
        title.style.margin = "0";
        title.style.fontSize = "28px";
        title.style.fontWeight = "700";
        title.style.textAlign = "center";
        title.style.color = "#ff5722";
        title.style.marginBottom = "20px";
        popup.appendChild(title);

        // Crear el contenedor de la lista con dos columnas
        let listContainer = document.createElement("div");
        listContainer.style.marginTop = "20px";
        listContainer.style.fontSize = "16px";
        listContainer.style.lineHeight = "1.6";
        listContainer.style.whiteSpace = "pre-wrap";
        listContainer.style.display = "grid";
        listContainer.style.gridTemplateColumns = "1fr 1fr";
        listContainer.style.gap = "10px";

        // Agregar los usuarios en dos columnas
        notFollowing.forEach(user => {
          let userLink = document.createElement("a");
          userLink.href = `https://x.com/${user}`;
          userLink.textContent = user;
          userLink.style.textDecoration = "none";
          userLink.style.color = "inherit";
          userLink.style.transition = "color 0.3s ease";

          userLink.onmouseover = function() {
            userLink.style.color = "#ff5722";
          };

          userLink.onmouseout = function() {
            userLink.style.color = "inherit";
          };

          listContainer.appendChild(userLink);
        });

        popup.appendChild(listContainer);

        // Botón de cerrar (X) en la parte superior derecha
        let closeButtonX = document.createElement("button");
        closeButtonX.innerHTML = "&times;";  // Añadir la X
        closeButtonX.style.backgroundColor = "transparent";
        closeButtonX.style.color = "#fff";
        closeButtonX.style.border = "none";
        closeButtonX.style.fontSize = "30px";
        closeButtonX.style.cursor = "pointer";
        closeButtonX.style.position = "absolute";
        closeButtonX.style.top = "10px";
        closeButtonX.style.right = "10px";
        closeButtonX.style.transition = "background-color 0.3s ease";
        closeButtonX.onmouseover = function() {
          closeButtonX.style.backgroundColor = "#e64a19";
        };
        closeButtonX.onmouseout = function() {
          closeButtonX.style.backgroundColor = "transparent";
        };
        closeButtonX.onclick = function() {
          document.body.removeChild(popup);
        };
        popup.appendChild(closeButtonX);

        // Botón de cerrar centrado en la parte inferior
        let closeButtonBottom = document.createElement("button");
        closeButtonBottom.textContent = "Cerrar";
        closeButtonBottom.style.marginTop = "20px";
        closeButtonBottom.style.padding = "10px 20px";
        closeButtonBottom.style.backgroundColor = "#ff5722";
        closeButtonBottom.style.color = "#fff";
        closeButtonBottom.style.border = "none";
        closeButtonBottom.style.borderRadius = "5px";
        closeButtonBottom.style.cursor = "pointer";
        closeButtonBottom.style.fontSize = "16px";
        closeButtonBottom.style.display = "block";
        closeButtonBottom.style.marginLeft = "auto";
        closeButtonBottom.style.marginRight = "auto";
        closeButtonBottom.onclick = function() {
          document.body.removeChild(popup);
        };
        popup.appendChild(closeButtonBottom);

        document.body.appendChild(popup);
      } else {
        console.log("Todos te siguen.");
      }
    }
  }
);
