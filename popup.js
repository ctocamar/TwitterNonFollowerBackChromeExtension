

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

function displayResults(notFollowing, titleText) {
  if (notFollowing.length > 0) {
    showPopup(notFollowing, titleText);
  } else {
    console.log("Everyone follows you back.");
  }
}

function showActionButtons() {
  // Crear un contenedor para los botones
  const buttonContainer = document.createElement('div');
  Object.assign(buttonContainer.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1e1e1e', // Fondo oscuro
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.5)',
    zIndex: '1000',
    textAlign: 'center',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  });

  // Botón de cierre "X"
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  Object.assign(closeButton.style, {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    color: '#fff',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  });
  closeButton.onmouseenter = () => (closeButton.style.color = '#f00');
  closeButton.onmouseleave = () => (closeButton.style.color = '#fff');
  closeButton.onclick = function () {
    closeButtonPanel(buttonContainer);
  };

  // Estilo de botones modernos
  const createButton = (text, bgColor, hoverColor, action) => {
    const button = document.createElement('button');
    button.textContent = text;
    Object.assign(button.style, {
      backgroundColor: bgColor,
      color: '#fff',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      outline: 'none',
      boxShadow: '0 4px 8px rgba(255, 255, 255, 0.1)',
    });
    button.onmouseenter = () => (button.style.backgroundColor = hoverColor);
    button.onmouseleave = () => (button.style.backgroundColor = bgColor);
    button.onmousedown = () => (button.style.transform = 'scale(0.95)');
    button.onmouseup = () => (button.style.transform = 'scale(1)');
    button.onclick = action;
    return button;
  };

  const buttonA = createButton('Followers Back', '#FF5733', '#E04E2A', () => {
    showNotFollowerBack();
    closeButtonPanel(buttonContainer);
  });

  const buttonB = createButton('Following Back', '#9C27B0', '#7B1FA2', () => {
    showNotFollowingBack();
    closeButtonPanel(buttonContainer);
  });

  // Añadir elementos al contenedor
  buttonContainer.appendChild(closeButton);
  buttonContainer.appendChild(buttonA);
  buttonContainer.appendChild(buttonB);
  
  // Añadir el contenedor al cuerpo del documento
  document.body.appendChild(buttonContainer);
}

function closeButtonPanel(panel) {
  if (panel) {
    panel.remove();
  }
}



function showPopup(users, titleText) {
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
  title.textContent = titleText;
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
