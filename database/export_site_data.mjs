import fs from "node:fs";
import vm from "node:vm";

const emptyList = Object.assign([], {
  forEach: Array.prototype.forEach,
  addEventListener() {}
});

function createSandbox() {
  const storage = new Map();
  const documentStub = {
    title: "",
    body: {
      classList: { add() {}, remove() {}, toggle() {} }
    },
    documentElement: { lang: "uk" },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return emptyList;
    },
    createElement() {
      return {
        className: "",
        innerHTML: "",
        dataset: {},
        classList: { add() {}, remove() {}, toggle() {} },
        querySelectorAll() {
          return [];
        }
      };
    },
    createTreeWalker() {
      return {
        nextNode() {
          return false;
        }
      };
    }
  };

  return {
    console,
    Date,
    Math,
    Number,
    String,
    Boolean,
    Set,
    Map,
    JSON,
    encodeURIComponent,
    setInterval() {
      return 0;
    },
    clearInterval() {},
    setTimeout(callback) {
      if (typeof callback === "function") callback();
      return 0;
    },
    clearTimeout() {},
    NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 },
    localStorage: {
      getItem(key) {
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
      removeItem(key) {
        storage.delete(key);
      }
    },
    document: documentStub,
    window: {
      location: { href: "" },
      matchMedia() {
        return { matches: false };
      }
    }
  };
}

function evaluateFile(path, expression) {
  const source = fs.readFileSync(path, "utf8");
  const sandbox = createSandbox();
  return vm.runInNewContext(`${source}\n${expression}`, sandbox, {
    filename: path,
    timeout: 5000
  });
}

const siteData = evaluateFile(
  "script.js",
  `JSON.stringify({
    adminEmails,
    specialtyGroups,
    trainerSpecialtyGroups,
    specialtySections,
    listings,
    moderationItems,
    adminReviewItems,
    specialistUsers,
    parentUsers,
    catalogSuggestions
  })`
);

const requestData = evaluateFile(
  "specialists.js",
  `JSON.stringify({
    requestData,
    specialtyOptions,
    formatOptions,
    categoryOptions,
    translations
  })`
);

fs.mkdirSync("database", { recursive: true });
fs.writeFileSync(
  "database/site-data.json",
  JSON.stringify(
    {
      ...JSON.parse(siteData),
      ...JSON.parse(requestData)
    },
    null,
    2
  ),
  "utf8"
);
