const authConfig = window.AUTH_CONFIG || {};

const elements = {
  status: document.querySelector("#authStatus"),
  googleMount: document.querySelector("#googleAuthButton"),
  googleNote: document.querySelector("#googleAuthNote"),
  emailToggle: document.querySelector("#emailLoginToggle"),
  emailForm: document.querySelector("#emailLoginForm")
};

let googleInitialized = false;

function requestedDestination(role = "") {
  const next = new URLSearchParams(window.location.search).get("next");
  if (next === "publish.html") return next;
  if (next === "cabinet.html") return next;
  if (next === "admin.html" && role === "admin") return next;
  return "";
}

function setStatus(message, type = "info") {
  if (!elements.status) return;
  elements.status.textContent = message;
  elements.status.dataset.status = type;
}

function toggleEmailLogin() {
  if (!elements.emailForm || !elements.emailToggle) return;
  const shouldOpen = elements.emailForm.hidden;
  elements.emailForm.hidden = !shouldOpen;
  elements.emailToggle.setAttribute("aria-expanded", String(shouldOpen));
  elements.emailToggle.classList.toggle("is-active", shouldOpen);
  setStatus("");
  if (shouldOpen) elements.emailForm.elements.email?.focus();
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Не вдалося увійти.");
  return result;
}

function rememberUser(user, provider) {
  if (user.email) {
    localStorage.setItem("siteUserEmail", user.email);
    localStorage.setItem("profileEmail", user.email);
  }
  if (user.phone) {
    localStorage.setItem("siteUserPhone", user.phone);
    localStorage.setItem("profilePhone", user.phone);
  }
  localStorage.setItem("siteUserName", user.name || "");
  localStorage.setItem("siteUserRole", user.role || "parent");
  localStorage.setItem("siteAuthProvider", provider);
  localStorage.setItem("siteAuthVerified", "true");
  if (user.id) localStorage.setItem("siteUserId", String(user.id));
  if (user.externalId) localStorage.setItem("siteUserExternalId", String(user.externalId));
}

function completeLogin(user, redirectUrl = "") {
  setStatus("Вхід виконано.", "success");
  window.dispatchEvent(new CustomEvent("site:authenticated", { detail: { user } }));
  const destination = requestedDestination(user.role) || redirectUrl || (user.role === "specialist" ? "specialists.html" : "index.html");
  window.setTimeout(() => {
    window.location.href = destination;
  }, 600);
}

const registrationLink = document.querySelector('.auth-switch-link a[href="register.php"]');
if (registrationLink && requestedDestination()) {
  registrationLink.href = `register.php?next=${encodeURIComponent(requestedDestination())}`;
}

function renderGoogleUnavailable(message) {
  if (!elements.googleMount) return;
  elements.googleMount.innerHTML = '<button class="google-auth-button" type="button" disabled><span aria-hidden="true">G</span>Увійти через Google</button>';
  if (elements.googleNote) elements.googleNote.textContent = message;
}

async function handleGoogleCredential(response) {
  if (!response?.credential) {
    setStatus("Google не повернув дані для входу.", "error");
    return;
  }
  setStatus("Перевіряємо Google-акаунт...");
  try {
    const result = await postJson(authConfig.googleVerifyEndpoint || "/api/auth/google.php", {
      mode: "login",
      credential: response.credential
    });
    const user = result.user || {};
    rememberUser(user, "google");
    completeLogin(user, result.redirect);
  } catch (error) {
    setStatus(error.message || "Не вдалося увійти через Google.", "error");
  }
}

function initializeGoogleLogin() {
  if (googleInitialized) return;
  if (!authConfig.googleClientId) {
    renderGoogleUnavailable("Google-вхід стане доступним після додавання OAuth Client ID.");
    return;
  }
  if (!window.google?.accounts?.id) {
    renderGoogleUnavailable("Не вдалося завантажити Google Identity Services.");
    return;
  }

  elements.googleMount.innerHTML = "";
  window.google.accounts.id.initialize({
    client_id: authConfig.googleClientId,
    callback: handleGoogleCredential,
    context: "signin",
    ux_mode: "popup",
    auto_select: false,
    itp_support: true,
    use_fedcm_for_prompt: true
  });
  window.google.accounts.id.renderButton(elements.googleMount, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signin_with",
    shape: "rectangular",
    logo_alignment: "left",
    width: Math.max(220, Math.min(360, Math.floor(elements.googleMount.getBoundingClientRect().width || 320)))
  });
  if (elements.googleNote) elements.googleNote.textContent = "";
  googleInitialized = true;
}

elements.emailToggle?.addEventListener("click", toggleEmailLogin);

document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => {
  document.querySelector(".site-header")?.classList.toggle("is-open");
});

elements.emailForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!event.currentTarget.checkValidity()) {
    event.currentTarget.reportValidity();
    return;
  }
  const data = new FormData(event.currentTarget);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  setStatus("Перевіряємо дані...");
  try {
    const result = await postJson(authConfig.emailLoginEndpoint || "/api/auth/login.php", { email, password });
    const user = result.user || {};
    rememberUser(user, "email");
    completeLogin(user, result.redirect);
  } catch (error) {
    setStatus(error.message || "Невірний email або пароль.", "error");
  }
});

const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
googleScript?.addEventListener("load", initializeGoogleLogin);
window.addEventListener("load", initializeGoogleLogin);
