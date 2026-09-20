const accountElements = {
  form: document.querySelector("#accountProfileForm"),
  formStatus: document.querySelector("#accountProfileStatus"),
  loadStatus: document.querySelector("#accountLoadStatus"),
  memberMeta: document.querySelector("#accountMemberMeta"),
  listingsCount: document.querySelector("#accountListingsCount"),
  notificationsCount: document.querySelector("#accountNotificationsCount"),
  emails: document.querySelector("#accountEmails"),
  phones: document.querySelector("#accountPhones"),
  listings: document.querySelector("#accountListings"),
  notifications: document.querySelector("#accountNotifications"),
  publishAction: document.querySelector("#accountPublishAction"),
  contactForms: document.querySelectorAll("[data-contact-form]"),
  deleteDialog: document.querySelector("#deleteAccountDialog"),
  deleteFirstStep: document.querySelector('[data-delete-step="first"]'),
  deleteSecondStep: document.querySelector('[data-delete-step="second"]'),
  deleteStatus: document.querySelector("#deleteAccountStatus"),
  openDelete: document.querySelector("#openDeleteAccount"),
  continueDelete: document.querySelector("#continueDeleteAccount"),
  backDelete: document.querySelector("#backDeleteAccount"),
  confirmDelete: document.querySelector("#confirmDeleteAccount"),
  tabs: document.querySelectorAll("[data-account-tab]"),
  views: document.querySelectorAll("[data-account-view]")
};

function setDeleteStep(step) {
  const second = step === "second";
  accountElements.deleteFirstStep.hidden = second;
  accountElements.deleteSecondStep.hidden = !second;
  accountElements.deleteStatus.textContent = "";
}

function closeDeleteDialog() {
  if (typeof accountElements.deleteDialog.close === "function") {
    accountElements.deleteDialog.close();
  } else {
    accountElements.deleteDialog.removeAttribute("open");
  }
  setDeleteStep("first");
}

function clearLocalAccount() {
  [
    "siteUserEmail", "siteUserPhone", "siteUserName", "siteUserRole",
    "siteAuthProvider", "siteAuthVerified", "siteUserId", "siteUserExternalId",
    "profileEmail", "profilePhone"
  ].forEach((key) => localStorage.removeItem(key));
}

function formatAccountDate(value) {
  if (!value) return "Дата не вказана";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

async function accountRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) },
    ...options
  });
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.href = `auth.php?next=${encodeURIComponent("cabinet.html")}`;
    throw new Error("Потрібно увійти в акаунт.");
  }
  if (!response.ok) throw new Error(result.message || "Не вдалося завантажити дані.");
  return result;
}

function contactStatus(type) {
  return document.querySelector(`[data-contact-status="${type}"]`);
}

function renderContacts(container, contacts, emptyText, type) {
  container.replaceChildren();
  if (!contacts.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty-inline";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }
  contacts.forEach((contact) => {
    const row = document.createElement("div");
    row.className = "account-contact-row";
    const value = document.createElement("span");
    value.textContent = contact.value;
    row.append(value);
    if (contact.primary) {
      const badge = document.createElement("small");
      badge.textContent = "Основний";
      row.append(badge);
    } else {
      const removeButton = document.createElement("button");
      removeButton.className = "account-contact-remove delete-action delete-action--icon-only";
      removeButton.type = "button";
      removeButton.title = `Видалити ${type === "email" ? "email" : "номер телефону"}`;
      removeButton.setAttribute("aria-label", removeButton.title);
      removeButton.addEventListener("click", () => removeAccountContact(type, contact.id, removeButton));
      row.append(removeButton);
    }
    container.append(row);
  });
}

function renderContactData(data) {
  renderContacts(accountElements.emails, data.emails, "Email не додано", "email");
  renderContacts(accountElements.phones, data.phones, "Телефон не додано", "phone");
}

function emptyFeed(text) {
  const empty = document.createElement("div");
  empty.className = "account-empty-state";
  const title = document.createElement("strong");
  title.textContent = text;
  empty.append(title);
  return empty;
}

function renderListings(listings) {
  accountElements.listings.replaceChildren();
  if (!listings.length) {
    accountElements.listings.append(emptyFeed("У вас ще немає оголошень"));
    return;
  }
  listings.forEach((listing) => {
    const article = document.createElement("article");
    article.className = "account-feed-item";
    const main = document.createElement("div");
    const type = document.createElement("span");
    type.className = "account-item-type";
    type.textContent = listing.kind === "request" ? "Запит" : "Оголошення фахівця";
    const title = document.createElement("h3");
    title.textContent = listing.title;
    const meta = document.createElement("p");
    meta.textContent = [listing.city ? `Місто: ${listing.city}` : "", `Створено: ${formatAccountDate(listing.created_at)}`].filter(Boolean).join(" · ");
    main.append(type, title, meta);
    const status = document.createElement("span");
    status.className = "account-status-badge";
    status.textContent = listing.status || "активне";
    article.append(main, status);
    accountElements.listings.append(article);
  });
}

function renderNotifications(notifications) {
  accountElements.notifications.replaceChildren();
  if (!notifications.length) {
    accountElements.notifications.append(emptyFeed("Нових сповіщень немає"));
    return;
  }
  notifications.forEach((notification) => {
    const article = document.createElement("article");
    article.className = "account-feed-item account-notification";
    const main = document.createElement("div");
    const author = document.createElement("h3");
    author.textContent = notification.author;
    const text = document.createElement("p");
    text.textContent = notification.text;
    main.append(author, text);
    const date = document.createElement("time");
    date.textContent = formatAccountDate(notification.created_at);
    article.append(main, date);
    accountElements.notifications.append(article);
  });
}

function renderAccount(data) {
  const profile = data.profile;
  const publishLabel = "Розмістити оголошення";
  accountElements.form.elements.firstName.value = profile.firstName || "";
  accountElements.form.elements.lastName.value = profile.lastName || "";
  accountElements.form.elements.email.value = profile.email || "";
  accountElements.form.elements.phone.value = profile.phone || "";
  accountElements.memberMeta.textContent = `Реєстрація: ${formatAccountDate(profile.registeredAt)}`;
  if (accountElements.publishAction) {
    accountElements.publishAction.textContent = publishLabel;
    accountElements.publishAction.setAttribute("aria-label", `${publishLabel} в особистому кабінеті`);
  }
  accountElements.listingsCount.textContent = String(data.listings.length);
  accountElements.notificationsCount.textContent = String(data.notifications.length);
  renderContactData(data);
  renderListings(data.listings);
  renderNotifications(data.notifications);
  accountElements.loadStatus.hidden = true;
}

function activateAccountView(name) {
  accountElements.tabs.forEach((tab) => {
    const active = tab.dataset.accountTab === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  accountElements.views.forEach((view) => {
    const active = view.dataset.accountView === name;
    view.classList.toggle("is-active", active);
    view.hidden = !active;
  });
}

async function loadAccount() {
  try {
    renderAccount(await accountRequest("/api/account/index.php"));
  } catch (error) {
    accountElements.loadStatus.textContent = error.message;
  }
}

accountElements.tabs.forEach((tab) => tab.addEventListener("click", () => activateAccountView(tab.dataset.accountTab)));

accountElements.contactForms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const type = form.dataset.contactForm;
    const value = String(new FormData(form).get("value") || "").trim();
    const status = contactStatus(type);
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    status.textContent = "Додаємо...";
    try {
      const result = await accountRequest("/api/account/contacts.php", {
        method: "POST",
        body: JSON.stringify({ type, value })
      });
      renderContactData(result);
      form.reset();
      status.textContent = type === "email" ? "Email додано." : "Номер телефону додано.";
    } catch (error) {
      status.textContent = error.message;
    } finally {
      submit.disabled = false;
    }
  });
});

async function removeAccountContact(type, id, button) {
  const status = contactStatus(type);
  button.disabled = true;
  status.textContent = "Видаляємо...";
  try {
    const result = await accountRequest("/api/account/delete-contact.php", {
      method: "POST",
      body: JSON.stringify({ type, id })
    });
    renderContactData(result);
    status.textContent = type === "email" ? "Email видалено." : "Номер телефону видалено.";
  } catch (error) {
    status.textContent = error.message;
    button.disabled = false;
  }
}

accountElements.form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!event.currentTarget.checkValidity()) {
    event.currentTarget.reportValidity();
    return;
  }
  const data = new FormData(event.currentTarget);
  accountElements.formStatus.textContent = "Зберігаємо...";
  try {
    const result = await accountRequest("/api/account/profile.php", {
      method: "POST",
      body: JSON.stringify({
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        phone: data.get("phone")
      })
    });
    renderAccount(result);
    const cabinetLink = document.querySelector(".header-cabinet-link");
    if (cabinetLink) cabinetLink.title = `Особистий кабінет: ${result.profile.name}`;
    accountElements.formStatus.textContent = "Зміни збережено.";
  } catch (error) {
    accountElements.formStatus.textContent = error.message;
  }
});

accountElements.openDelete?.addEventListener("click", () => {
  setDeleteStep("first");
  if (typeof accountElements.deleteDialog.showModal === "function") {
    accountElements.deleteDialog.showModal();
  } else {
    accountElements.deleteDialog.setAttribute("open", "");
  }
});

document.querySelectorAll("[data-delete-cancel]").forEach((button) => {
  button.addEventListener("click", closeDeleteDialog);
});

accountElements.continueDelete?.addEventListener("click", () => setDeleteStep("second"));
accountElements.backDelete?.addEventListener("click", () => setDeleteStep("first"));

accountElements.confirmDelete?.addEventListener("click", async () => {
  accountElements.confirmDelete.disabled = true;
  accountElements.deleteStatus.textContent = "Видаляємо акаунт...";
  try {
    await accountRequest("/api/account/delete.php", {
      method: "POST",
      body: JSON.stringify({ confirmation: "DELETE_ACCOUNT", confirmations: 2 })
    });
    clearLocalAccount();
    window.location.href = "index.html";
  } catch (error) {
    accountElements.deleteStatus.textContent = error.message;
    accountElements.confirmDelete.disabled = false;
  }
});

document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => {
  document.querySelector(".site-header")?.classList.toggle("is-open");
});

loadAccount();
