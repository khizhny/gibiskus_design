const authConfig = window.AUTH_CONFIG || {};

const elements = {
  tabs: document.querySelectorAll("[data-auth-tab]"),
  panes: document.querySelectorAll("[data-auth-pane]"),
  status: document.querySelector("#authStatus"),
  googleMount: document.querySelector("#googleAuthButton"),
  googleNote: document.querySelector("#googleAuthNote"),
  profileForm: document.querySelector("#registrationProfileForm"),
  methodSection: document.querySelector("#registrationMethodSection"),
  privacyAccepted: document.querySelector('[name="privacyAccepted"]'),
  firstName: document.querySelector('[name="firstName"]'),
  lastName: document.querySelector('[name="lastName"]'),
  phone: document.querySelector('[name="phone"]'),
  emailForm: document.querySelector("#emailAuthForm"),
  emailSubmit: document.querySelector("#emailRegistrationSubmit")
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

function activatePane(name) {
  elements.tabs.forEach((tab) => {
    const active = tab.dataset.authTab === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  elements.panes.forEach((pane) => {
    pane.classList.toggle("is-active", pane.dataset.authPane === name);
  });
  if (elements.emailSubmit) elements.emailSubmit.hidden = name !== "email";
  syncGoogleAvailability();
  setStatus("");
}

function syncRegistrationMethodVisibility() {
  if (!elements.methodSection || !elements.privacyAccepted) return;
  const accepted = elements.privacyAccepted.checked;
  elements.methodSection.hidden = !accepted;
  if (!accepted) setStatus("");
}

function syncRegistrationState(event) {
  if (event?.target === elements.phone) sanitizePhoneInput();
  syncRegistrationMethodVisibility();
  syncGoogleAvailability();
}

function sanitizePhoneInput() {
  if (!elements.phone) return;
  let digits = elements.phone.value.replace(/\D/g, "");
  if (digits.startsWith("380") && digits.length > 9) digits = digits.slice(3);
  elements.phone.value = digits.slice(0, 9);
}

function getRegistrationProfile({ report = false } = {}) {
  if (!elements.profileForm) return null;
  if (!elements.profileForm.checkValidity()) {
    if (report) {
      elements.profileForm.reportValidity();
      setStatus("Заповніть ім'я, прізвище, дев'ять цифр номера телефону, тип профілю та прийміть політику конфіденційності.", "error");
    }
    return null;
  }

  const data = new FormData(elements.profileForm);
  return {
    firstName: String(data.get("firstName") || "").trim(),
    lastName: String(data.get("lastName") || "").trim(),
    phone: `+380${String(data.get("phone") || "").trim()}`,
    role: String(data.get("role") || "parent"),
    privacyAccepted: data.get("privacyAccepted") === "on"
  };
}

function rememberUser(user, provider, fallbackProfile = {}) {
  const name = user.name || [fallbackProfile.firstName, fallbackProfile.lastName].filter(Boolean).join(" ");
  const role = user.role || fallbackProfile.role || "parent";
  const phone = user.phone || fallbackProfile.phone || "";
  if (user.email) {
    localStorage.setItem("siteUserEmail", user.email);
    localStorage.setItem("profileEmail", user.email);
  }
  if (phone) {
    localStorage.setItem("siteUserPhone", phone);
    localStorage.setItem("profilePhone", phone);
  }
  localStorage.setItem("siteUserName", name);
  localStorage.setItem("siteUserRole", role);
  localStorage.setItem("siteAuthProvider", provider);
  localStorage.setItem("siteAuthVerified", "true");
  if (user.id) localStorage.setItem("siteUserId", String(user.id));
  if (user.externalId) localStorage.setItem("siteUserExternalId", String(user.externalId));
}

function completeRegistration(message, user, redirectUrl = "") {
  setStatus(message, "success");
  const destination = requestedDestination(user.role) || redirectUrl || (user.role === "specialist" ? "specialists.html" : "index.html");
  window.setTimeout(() => {
    window.location.href = destination;
  }, 700);
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
  if (!response.ok) throw new Error(result.message || "Не вдалося створити акаунт.");
  return result;
}

function renderGoogleUnavailable(message) {
  if (!elements.googleMount) return;
  elements.googleMount.innerHTML = '<button class="google-auth-button" type="button" disabled><span aria-hidden="true">G</span>Зареєструватися через Google</button>';
  if (elements.googleNote) elements.googleNote.textContent = message;
}

async function handleGoogleCredential(response) {
  const profile = getRegistrationProfile({ report: true });
  if (!profile) return;
  if (!response?.credential) {
    setStatus("Google не повернув дані для автентифікації.", "error");
    return;
  }

  setStatus("Перевіряємо Google-акаунт...");
  try {
    const result = await postJson(authConfig.googleVerifyEndpoint || "/api/auth/google.php", {
      mode: "register",
      credential: response.credential,
      ...profile
    });
    const user = result.user || {};
    rememberUser(user, "google", profile);
    completeRegistration("Google-акаунт підтверджено. Профіль створено.", user, result.redirect);
  } catch (error) {
    setStatus(error.message || "Не вдалося завершити реєстрацію через Google.", "error");
  }
}

function initializeGoogleRegistration() {
  if (googleInitialized) return;
  if (!authConfig.googleClientId) {
    renderGoogleUnavailable("Google-реєстрація стане доступною після додавання OAuth Client ID.");
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
    context: "signup",
    ux_mode: "popup",
    auto_select: false,
    itp_support: true,
    use_fedcm_for_prompt: true
  });
  window.google.accounts.id.renderButton(elements.googleMount, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    shape: "rectangular",
    logo_alignment: "left",
    width: Math.max(220, Math.min(360, Math.floor(elements.googleMount.getBoundingClientRect().width || 320)))
  });
  if (elements.googleNote) elements.googleNote.textContent = "";
  googleInitialized = true;
  syncGoogleAvailability();
}

function syncGoogleAvailability() {
  const profileReady = Boolean(getRegistrationProfile());
  elements.googleMount?.classList.toggle("is-disabled", !profileReady);
  elements.googleMount?.setAttribute("aria-disabled", String(!profileReady));
  if (elements.googleNote && authConfig.googleClientId) {
    elements.googleNote.textContent = profileReady ? "" : "Спочатку заповніть дані профілю та прийміть політику конфіденційності.";
  }
}

elements.tabs.forEach((tab) => {
  tab.addEventListener("click", () => activatePane(tab.dataset.authTab));
});

document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => {
  document.querySelector(".site-header")?.classList.toggle("is-open");
});

elements.profileForm?.addEventListener("submit", (event) => event.preventDefault());
elements.profileForm?.addEventListener("input", syncRegistrationState);
elements.profileForm?.addEventListener("change", syncRegistrationState);

elements.emailForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const profile = getRegistrationProfile({ report: true });
  if (!profile) return;
  if (!event.currentTarget.checkValidity()) {
    event.currentTarget.reportValidity();
    return;
  }

  const data = new FormData(event.currentTarget);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const passwordConfirm = String(data.get("passwordConfirm") || "");
  if (password !== passwordConfirm) {
    setStatus("Паролі не збігаються.", "error");
    event.currentTarget.elements.passwordConfirm.focus();
    return;
  }

  setStatus("Створюємо акаунт...");
  try {
    const result = await postJson(authConfig.emailRegisterEndpoint || "/api/auth/register.php", {
      email,
      password,
      ...profile
    });
    const user = result.user || {};
    rememberUser(user, "email", profile);
    completeRegistration("Акаунт створено.", user, result.redirect);
  } catch (error) {
    setStatus(error.message || "Не вдалося створити акаунт.", "error");
  }
});

const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
googleScript?.addEventListener("load", initializeGoogleRegistration);
window.addEventListener("load", initializeGoogleRegistration);
activatePane("google");
syncRegistrationMethodVisibility();
