function showSpinner() {
  const spinner = document.createElement("div");
  spinner.id = "loadingSpinner";
  Object.assign(spinner.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60px",
    height: "60px",
    border: "8px solid transparent",
    borderTop: "8px solid #ff5722",
    borderRadius: "50%",
    animation: "spin 1.5s linear infinite",
    zIndex: "10000",
  });
  document.body.appendChild(spinner);

  const style = document.createElement("style");
  style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

function hideSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) document.body.removeChild(spinner);
}

function displayResults(notFollowing) {
  if (notFollowing.length > 0) {
    showPopup(notFollowing);
  } else {
    console.log("Everyone follows you back.");
  }
}

function showPopup(users) {
  const popup = document.createElement("div");
  Object.assign(popup.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: "20px 30px",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
    zIndex: "10000",
    maxHeight: "80vh",
    overflowY: "auto",
    width: "90%",
    maxWidth: "600px",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
  });

  const closeButtonX = document.createElement("button");
  closeButtonX.textContent = "✖";
  Object.assign(closeButtonX.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    color: "#ff5722",
    fontSize: "20px",
    cursor: "pointer",
  });

  closeButtonX.onclick = () => document.body.removeChild(popup);
  popup.appendChild(closeButtonX);

  const title = document.createElement("h2");
  title.textContent = "Users who don't follow you back";
  title.style.color = "#ff5722";
  popup.appendChild(title);

  const listContainer = document.createElement("div");
  listContainer.style.display = "grid";
  listContainer.style.gridTemplateColumns = "1fr 1fr";
  listContainer.style.gap = "10px";

  users.forEach((user) => {
    const userLink = document.createElement("a");
    userLink.href = `https://x.com/${user}`;
    userLink.textContent = user;
    Object.assign(userLink.style, {
      textDecoration: "none",
      color: "inherit",
      transition: "color 0.3s ease",
    });

    userLink.onmouseover = () => (userLink.style.color = "#ff5722");
    userLink.onmouseout = () => (userLink.style.color = "inherit");

    listContainer.appendChild(userLink);
  });

  popup.appendChild(listContainer);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  Object.assign(closeButton.style, {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#ff5722",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  });

  closeButton.onclick = () => document.body.removeChild(popup);
  popup.appendChild(closeButton);

  document.body.appendChild(popup);
}
