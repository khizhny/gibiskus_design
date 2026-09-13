const SESSION_ENDPOINT = "/api/auth/me.php";
const PUBLISH_PAGE = "publish.html";

function updatePublishLinks(authenticated) {
  document.querySelectorAll(`a[href="${PUBLISH_PAGE}"], a[data-publish-link]`).forEach((link) => {
    link.dataset.publishLink = "true";
    link.classList.toggle("is-authorized-publish", authenticated);
    link.hidden = !authenticated;
  });
}

function updateAdminNavigation(role = "") {
  document.querySelectorAll('.nav a[href="admin.html"]').forEach((link) => {
    link.classList.toggle("is-authorized-admin", role === "admin");
    link.setAttribute("aria-hidden", String(role !== "admin"));
  });
}

function clearRememberedSession() {
  [
    "siteUserEmail",
    "siteUserPhone",
    "siteUserName",
    "siteUserRole",
    "siteAuthProvider",
    "siteAuthVerified",
    "siteUserId",
    "siteUserExternalId"
  ].forEach((key) => localStorage.removeItem(key));
}

function rememberSessionUser(user) {
  if (user.id) localStorage.setItem("siteUserId", String(user.id));
  localStorage.setItem("siteUserName", user.name || "");
  localStorage.setItem("siteUserRole", user.role || "parent");
  localStorage.setItem("siteAuthVerified", "true");
  if (user.email) localStorage.setItem("siteUserEmail", user.email);
  if (user.phone) localStorage.setItem("siteUserPhone", user.phone);
}

async function logoutCurrentUser(button) {
  button.disabled = true;
  try {
    const response = await fetch("/api/auth/logout.php", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Logout failed");
    clearRememberedSession();
    window.location.href = "index.html";
  } catch (error) {
    button.disabled = false;
  }
}

function showCurrentUser(user) {
  const headerActions = document.querySelector(".header-actions");
  if (!headerActions || headerActions.querySelector(".header-logout-button")) return;
  const loginLink = headerActions.querySelector('a[href^="auth.php"]');

  const displayName = String(user.name || user.email || "Користувач").trim();
  const cabinetLink = document.createElement("a");
  cabinetLink.className = "header-cabinet-link";
  cabinetLink.href = "cabinet.html";
  cabinetLink.textContent = "Мій кабінет";
  cabinetLink.title = `Особистий кабінет: ${displayName}`;
  cabinetLink.setAttribute("aria-label", `${displayName}, відкрити особистий кабінет`);

  const logoutButton = document.createElement("button");
  logoutButton.className = `${loginLink?.className || "ghost-button"} header-logout-button`.trim();
  logoutButton.type = "button";
  logoutButton.textContent = "Вийти";
  logoutButton.addEventListener("click", () => logoutCurrentUser(logoutButton));
  if (loginLink) {
    loginLink.replaceWith(logoutButton);
    logoutButton.insertAdjacentElement("beforebegin", cabinetLink);
  } else {
    headerActions.append(cabinetLink, logoutButton);
  }
}

function applyAuthenticatedUser(user) {
  rememberSessionUser(user);
  showCurrentUser(user);
  updatePublishLinks(true);
  updateAdminNavigation(user.role);
}

window.addEventListener("site:authenticated", (event) => {
  const user = event.detail?.user;
  if (user) applyAuthenticatedUser(user);
});

async function refreshSessionHeader() {
  try {
    const response = await fetch(SESSION_ENDPOINT, {
      credentials: "same-origin",
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      clearRememberedSession();
      updatePublishLinks(false);
      updateAdminNavigation();
      return;
    }

    const result = await response.json();
    if (!result.authenticated || !result.user) {
      clearRememberedSession();
      updatePublishLinks(false);
      updateAdminNavigation();
      return;
    }

    applyAuthenticatedUser(result.user);
  } catch (error) {
    updatePublishLinks(false);
    updateAdminNavigation();
  }
}

refreshSessionHeader();
