// DOM Elements
const formDOM = document.querySelector(".form");
const usernameInputDOM = document.querySelector(".username-input");
const passwordInputDOM = document.querySelector(".password-input");
const formAlertDOM = document.querySelector(".form-alert");
const resultDOM = document.querySelector(".result");
const btnDOM = document.querySelector("#data");
const tokenDOM = document.querySelector(".token");

// Login/Register form submission
formDOM.addEventListener("submit", async (e) => {
  formAlertDOM.classList.remove("text-success");
  tokenDOM.classList.remove("text-success");

  e.preventDefault();
  const username = usernameInputDOM.value;
  const password = passwordInputDOM.value;

  // Show loading state
  const formButton = formDOM.querySelector("button");
  const originalButtonText = formButton.innerHTML;
  formButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  formButton.disabled = true;

  try {
    const { data } = await axios.post("/api/v1/login", { username, password });

    formAlertDOM.style.display = "flex";
    formAlertDOM.innerHTML = `<i class="fas fa-check-circle"></i><span>${data.msg}</span>`;

    formAlertDOM.classList.add("text-success");
    usernameInputDOM.value = "";
    passwordInputDOM.value = "";

    localStorage.setItem("token", data.token);
    resultDOM.innerHTML =
      '<div class="empty-state"><i class="fas fa-check-circle"></i><p>Authentication successful</p></div>';
    tokenDOM.innerHTML =
      '<i class="fas fa-check-circle"></i> <span>Token present</span>';
    tokenDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "flex";
    formAlertDOM.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${error.response.data.msg}</span>`;
    localStorage.removeItem("token");
    resultDOM.innerHTML =
      '<div class="empty-state"><i class="fas fa-database"></i><p>Secure data will appear here</p></div>';
    tokenDOM.innerHTML =
      '<i class="fas fa-times-circle"></i> <span>No token present</span>';
    tokenDOM.classList.remove("text-success");
  }

  // Restore button state
  setTimeout(() => {
    formButton.innerHTML = originalButtonText;
    formButton.disabled = false;
  }, 500);

  // Hide alert after a delay
  setTimeout(() => {
    formAlertDOM.style.display = "none";
  }, 3000);
});

// Get data button click
btnDOM.addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  // Show loading state
  const originalButtonText = btnDOM.innerHTML;
  btnDOM.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading Data...';
  btnDOM.disabled = true;

  try {
    const { data } = await axios.get("/api/v1/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    resultDOM.innerHTML = `
      <h5><i class="fas fa-unlock-alt"></i> ${data.msg}</h5>
      <p>${data.secret}</p>
    `;

    // Add a subtle animation to the result
    resultDOM.style.animation = "fadeIn 0.5s ease-in-out";
    setTimeout(() => {
      resultDOM.style.animation = "";
    }, 500);
  } catch (error) {
    localStorage.removeItem("token");
    resultDOM.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${error.response.data.msg}</p>
      </div>
    `;
    tokenDOM.innerHTML =
      '<i class="fas fa-times-circle"></i> <span>No token present</span>';
    tokenDOM.classList.remove("text-success");
  }

  // Restore button state
  setTimeout(() => {
    btnDOM.innerHTML = originalButtonText;
    btnDOM.disabled = false;
  }, 500);
});

// Check for token on page load
const checkToken = () => {
  tokenDOM.classList.remove("text-success");

  const token = localStorage.getItem("token");
  if (token) {
    tokenDOM.innerHTML =
      '<i class="fas fa-check-circle"></i> <span>Token present</span>';
    tokenDOM.classList.add("text-success");
  } else {
    tokenDOM.innerHTML =
      '<i class="fas fa-times-circle"></i> <span>No token present</span>';
  }
};

// Initialize
checkToken();
