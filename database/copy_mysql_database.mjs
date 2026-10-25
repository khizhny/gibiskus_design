import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mysql = process.env.MYSQL_BIN || "mysql";
const mysqldump = process.env.MYSQLDUMP_BIN || "mysqldump";

const source = {
  host: process.env.SOURCE_DB_HOST || "127.0.0.1",
  port: process.env.SOURCE_DB_PORT || "3306",
  user: process.env.SOURCE_DB_USER || "website",
  password: process.env.SOURCE_DB_PASSWORD || "",
  database: process.env.SOURCE_DB_NAME || "website"
};
const target = {
  host: process.env.TARGET_DB_HOST || "",
  port: process.env.TARGET_DB_PORT || "3306",
  user: process.env.TARGET_DB_USER || "",
  password: process.env.TARGET_DB_PASSWORD || "",
  database: process.env.TARGET_DB_NAME || ""
};

for (const [name, value] of Object.entries({
  SOURCE_DB_PASSWORD: source.password,
  TARGET_DB_HOST: target.host,
  TARGET_DB_USER: target.user,
  TARGET_DB_PASSWORD: target.password,
  TARGET_DB_NAME: target.database
})) {
  if (!value) throw new Error(`${name} is required`);
}
for (const database of [source.database, target.database]) {
  if (!/^[A-Za-z0-9_]+$/.test(database)) throw new Error("Database names may contain only letters, digits and underscores");
}

const connectionArgs = (database, config) => [
  "--protocol=TCP", "-h", config.host, "-P", config.port, "-u", config.user, database
];

function runWithInput(command, args, password, input, capture = false) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, MYSQL_PWD: password },
      stdio: ["pipe", capture ? "pipe" : "inherit", "inherit"]
    });
    let output = "";
    if (capture) child.stdout.setEncoding("utf8").on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolvePromise(output) : reject(new Error(`${command} exited with code ${code}`)));
    child.stdin.end(input);
  });
}

function mariaDbSchema() {
  let schema = readFileSync(resolve(root, "database/schema.mysql.sql"), "utf8")
    .replaceAll("utf8mb4_0900_ai_ci", "utf8mb4_unicode_ci")
    .replace(/^SET FOREIGN_KEY_CHECKS.*;\s*$/gm, "")
    .replace(/^DROP (?:VIEW|TABLE).*;\s*$/gm, "")
    .replace(/^CREATE VIEW oblasti AS[\s\S]*?WHERE l2_parent_id IS NULL;\s*$/m, "");
  schema = schema.replace(/CREATE TABLE ([A-Za-z_]+)/g, "CREATE TABLE IF NOT EXISTS $1");
  schema = schema.replace(/^\s*CONSTRAINT\s+[^\n]+\n/gm, "");
  schema = schema.replace(/,\s*\n\)/g, "\n)");
  return schema;
}

const existing = await runWithInput(
  mysql,
  [...connectionArgs(target.database, target), "--batch", "--skip-column-names"],
  target.password,
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE();",
  true
);
if (Number(existing.trim()) !== 0) {
  throw new Error(`Target database ${target.database} is not empty; refusing to overwrite it`);
}

await runWithInput(mysql, connectionArgs(target.database, target), target.password, mariaDbSchema());

await new Promise((resolvePromise, reject) => {
  const dump = spawn(mysqldump, [
    ...connectionArgs(source.database, source),
    "--no-create-info", "--skip-triggers", "--single-transaction", "--hex-blob",
    "--complete-insert", "--skip-add-locks", "--set-gtid-purged=OFF", "--column-statistics=0"
  ], {
    cwd: root,
    env: { ...process.env, MYSQL_PWD: source.password },
    stdio: ["ignore", "pipe", "inherit"]
  });
  const load = spawn(mysql, connectionArgs(target.database, target), {
    cwd: root,
    env: { ...process.env, MYSQL_PWD: target.password },
    stdio: ["pipe", "inherit", "inherit"]
  });
  dump.stdout.pipe(load.stdin);
  let dumpCode = null;
  let loadCode = null;
  const finish = () => {
    if (dumpCode === null || loadCode === null) return;
    if (dumpCode === 0 && loadCode === 0) resolvePromise();
    else reject(new Error(`Database copy failed (mysqldump=${dumpCode}, mysql=${loadCode})`));
  };
  dump.on("error", reject);
  load.on("error", reject);
  dump.on("exit", (code) => { dumpCode = code; finish(); });
  load.on("exit", (code) => { loadCode = code; finish(); });
});

console.log(`Copied ${source.database} to ${target.host}/${target.database}.`);
