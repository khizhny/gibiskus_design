import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mysql = process.env.MYSQL_BIN || "mysql";
const host = process.env.DB_HOST || "127.0.0.1";
const port = process.env.DB_PORT || "3306";
const user = process.env.DB_USER || "website";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "website";
const skipSchema = process.env.SKIP_SCHEMA === "1";
const skipCreateDatabase = process.env.SKIP_CREATE_DATABASE === "1";
const dialect = process.env.DB_DIALECT || "mysql";

if (!password) {
  throw new Error("DB_PASSWORD is required");
}
if (!/^[A-Za-z0-9_]+$/.test(database)) {
  throw new Error("DB_NAME may contain only letters, digits and underscores");
}

function mysqlProcess(args = []) {
  return spawn(mysql, ["--protocol=TCP", "-h", host, "-P", port, "-u", user, ...args], {
    cwd: root,
    env: { ...process.env, MYSQL_PWD: password },
    stdio: ["pipe", "inherit", "inherit"]
  });
}

function writeAndWait(child, sql) {
  return new Promise((resolvePromise, reject) => {
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(`mysql exited with code ${code}`)));
    child.stdin.end(sql);
  });
}

function sqlValue(value, column) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "bigint" || typeof value === "number") return String(value);
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) return `X'${Buffer.from(value).toString("hex")}'`;
  let text = String(value);
  if (column.endsWith("_at") || column === "registered_at" || column === "last_active" || column === "expires_at") {
    const parsed = new Date(text);
    if (!Number.isNaN(parsed.valueOf())) text = parsed.toISOString().slice(0, 19).replace("T", " ");
  }
  return `'${text.replaceAll("\\", "\\\\").replaceAll("'", "''").replaceAll("\0", "\\0")}'`;
}

function insertStatements(sqlite, table, batchSize = 500) {
  const tableExists = sqlite.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").get(table);
  let rows = table === "Emails" && !tableExists
    ? sqlite.prepare("SELECT id AS user_id, email FROM Users WHERE email IS NOT NULL AND trim(email) != ''").all()
    : table === "GoogleId" && !tableExists
      ? sqlite.prepare("SELECT id AS user_id, external_id FROM Users WHERE external_id IS NOT NULL AND trim(external_id) != ''").all()
    : tableExists ? sqlite.prepare(`SELECT * FROM \"${table.replaceAll('"', '""')}\"`).all() : [];
  if (table === "Specialists") {
    rows = rows.map((row) => {
      let online = Number(row.online || 0) === 1 ? 1 : 0;
      if (Object.hasOwn(row, "formats_json")) {
        try { online = JSON.parse(row.formats_json || "[]").includes("Онлайн") ? 1 : 0; } catch { online = 0; }
      }
      const experienceMatch = String(row.experience ?? "").match(/\d+/);
      return { ...row, online, experience: experienceMatch ? Math.min(Number(experienceMatch[0]), 100) : null };
    });
  }
  if (rows.length === 0) return [];
  const columns = Object.keys(rows[0]).filter(
    (column) => !(
      (table === "Specialists" && ["name", "initials", "district", "notes", "catalog_record_id", "formats_json", "nosologies_json", "schedule", "response_time"].includes(column)) ||
      (table === "Users" && (column === "email" || column === "external_id" || column === "notes"))
    )
  );
  const columnList = columns.map((column) => `\`${column}\``).join(", ");
  const statements = [];
  for (let start = 0; start < rows.length; start += batchSize) {
    const values = rows.slice(start, start + batchSize).map((row) =>
      `(${columns.map((column) => sqlValue(row[column], column)).join(", ")})`
    );
    statements.push(`INSERT INTO \`${table}\` (${columnList}) VALUES\n${values.join(",\n")};`);
  }
  return statements;
}

const siteTables = [
  "Users", "Emails", "GoogleId", "Phones", "Admins", "UserCredentials", "EmailVerifications", "AppSettings",
  "PasswordResetRequests", "Catalog_groups", "Catalog_subgroups", "Catalog_record", "Specialists",
  "Districts", "SpecialistRecords", "Requests", "Messages", "Comments", "Abuses"
];
const mapTables = ["entry_types", "entries"];

if (!skipSchema) {
  if (!skipCreateDatabase) {
    const createDatabase = mysqlProcess();
    const collation = dialect === "mariadb" ? "utf8mb4_unicode_ci" : "utf8mb4_0900_ai_ci";
    await writeAndWait(createDatabase, `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE ${collation};`);
  }

  let schema = readFileSync(resolve(root, "database/schema.mysql.sql"), "utf8");
  if (dialect === "mariadb") schema = schema.replaceAll("utf8mb4_0900_ai_ci", "utf8mb4_unicode_ci");
  await writeAndWait(mysqlProcess([database]), schema);
}

const site = new DatabaseSync(resolve(root, "private/site.sqlite"), { readOnly: true });
const map = new DatabaseSync(resolve(root, "database/map.sqlite"), { readOnly: true });
try {
  const statements = ["SET NAMES utf8mb4;", "SET FOREIGN_KEY_CHECKS = 0;", "START TRANSACTION;"];
  for (const table of siteTables) statements.push(...insertStatements(site, table));
  for (const table of mapTables) statements.push(...insertStatements(map, table));
  statements.push("COMMIT;", "SET FOREIGN_KEY_CHECKS = 1;");
  await writeAndWait(mysqlProcess([database]), statements.join("\n"));
} finally {
  site.close();
  map.close();
}

console.log(`Migrated SQLite data to MySQL database ${database}.`);
