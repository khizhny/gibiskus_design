import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "database" / "site.sqlite"
GENERATED_DB_PATH = ROOT / "database" / "site.generated.sqlite"
DATA_PATH = ROOT / "database" / "site-data.json"
SCHEMA_PATH = ROOT / "database" / "schema.sql"


def dumps(value):
    return json.dumps(value, ensure_ascii=False) if value is not None else None


def text_value(value, lang="uk"):
    if isinstance(value, dict):
        return value.get(lang) or value.get("en") or next(iter(value.values()), "")
    return value or ""


def first_or_create(cursor, table, unique_column, value, extra=None):
    cursor.execute(f"SELECT id FROM {table} WHERE {unique_column} = ?", (value,))
    row = cursor.fetchone()
    if row:
        return row[0]
    columns = [unique_column]
    values = [value]
    if extra:
        for key, item in extra.items():
            columns.append(key)
            values.append(item)
    placeholders = ", ".join("?" for _ in values)
    cursor.execute(
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders})",
        values,
    )
    return cursor.lastrowid


SCHEMA = """
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS Abuses;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Requests;
DROP TABLE IF EXISTS SpecialistRecords;
DROP TABLE IF EXISTS Specialists;
DROP TABLE IF EXISTS Catalog_record;
DROP TABLE IF EXISTS Catalog_subgroups;
DROP TABLE IF EXISTS Catalog_groups;
DROP TABLE IF EXISTS UserCredentials;
DROP TABLE IF EXISTS Emails;
DROP TABLE IF EXISTS Phones;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Cities;
DROP TABLE IF EXISTS Countries;

CREATE TABLE Countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE
);

CREATE TABLE Cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  slug TEXT,
  FOREIGN KEY (country_id) REFERENCES Countries(id) ON DELETE CASCADE,
  UNIQUE (country_id, name)
);

CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'specialist', 'parent', 'system')),
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  registered_at TEXT,
  last_active TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Phones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  phone TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX uq_emails_email_nocase ON Emails(lower(email));

CREATE TABLE UserCredentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Catalog_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE Catalog_subgroups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (group_id) REFERENCES Catalog_groups(id) ON DELETE CASCADE,
  UNIQUE (group_id, title)
);

CREATE TABLE Catalog_record (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subgroup_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (subgroup_id) REFERENCES Catalog_subgroups(id) ON DELETE CASCADE,
  UNIQUE (subgroup_id, title)
);

CREATE TABLE Specialists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  catalog_record_id INTEGER,
  city TEXT,
  name TEXT NOT NULL,
  initials TEXT,
  price INTEGER,
  duration_minutes INTEGER,
  rating REAL,
  reviews_count INTEGER DEFAULT 0,
  district TEXT,
  formats_json TEXT,
  nosologies_json TEXT,
  schedule TEXT,
  response_time TEXT,
  bio TEXT,
  education TEXT,
  experience TEXT,
  created_at TEXT,
  expires_at TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (catalog_record_id) REFERENCES Catalog_record(id) ON DELETE CASCADE
);

CREATE TABLE SpecialistRecords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  specialist_id INTEGER NOT NULL,
  catalog_record_id INTEGER NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE,
  FOREIGN KEY (catalog_record_id) REFERENCES Catalog_record(id) ON DELETE CASCADE,
  UNIQUE (specialist_id, catalog_record_id)
);

CREATE TABLE Requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  catalog_record_id INTEGER,
  city TEXT,
  title TEXT NOT NULL,
  description TEXT,
  budget INTEGER,
  urgent INTEGER NOT NULL DEFAULT 0,
  available_time TEXT,
  formats_json TEXT,
  tags_json TEXT,
  created_at TEXT,
  status TEXT DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (catalog_record_id) REFERENCES Catalog_record(id) ON DELETE CASCADE
);

CREATE TABLE Messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_user_id INTEGER,
  recipient_user_id INTEGER,
  specialist_id INTEGER,
  request_id INTEGER,
  body TEXT NOT NULL,
  is_reply INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  dislike_count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (sender_user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE,
  FOREIGN KEY (request_id) REFERENCES Requests(id) ON DELETE CASCADE
);

CREATE TABLE Comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  specialist_id INTEGER,
  body TEXT NOT NULL,
  rating REAL,
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  moderated INTEGER NOT NULL DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE
);

CREATE TABLE Abuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_user_id INTEGER,
  specialist_id INTEGER,
  request_id INTEGER,
  message_id INTEGER,
  comment_id INTEGER,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE,
  FOREIGN KEY (request_id) REFERENCES Requests(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES Messages(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE
);
"""


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf8"))
    SCHEMA_PATH.write_text(SCHEMA.strip() + "\n", encoding="utf8")
    db_path = DB_PATH
    try:
        DB_PATH.unlink(missing_ok=True)
    except PermissionError:
        db_path = GENERATED_DB_PATH
        GENERATED_DB_PATH.unlink(missing_ok=True)

    connection = sqlite3.connect(db_path)
    connection.execute("PRAGMA foreign_keys = ON")
    cursor = connection.cursor()
    cursor.executescript(SCHEMA)

    ua_id = first_or_create(cursor, "Countries", "name", "Україна", {"code": "UA"})
    city_ids = {}
    for name in ["Київ", "Львів", "Одеса", "Дніпро", "Онлайн"]:
        city_ids[name] = first_or_create(cursor, "Cities", "name", name, {"country_id": ua_id, "slug": name.lower()})

    catalog_record_ids = {}
    catalog_group_order = 0
    for section in data["specialtySections"]:
        catalog_group_order += 1
        group_id = first_or_create(
            cursor,
            "Catalog_groups",
            "title",
            section["title"],
            {"description": section.get("description"), "sort_order": catalog_group_order, "enabled": 1},
        )
        for subgroup_order, subgroup in enumerate(section["groups"], start=1):
            subgroup_id = first_or_create(
                cursor,
                "Catalog_subgroups",
                "title",
                subgroup["title"],
                {"group_id": group_id, "description": subgroup.get("description"), "sort_order": subgroup_order, "enabled": 1},
            )
            for record_order, record_title in enumerate(subgroup["items"], start=1):
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO Catalog_record (subgroup_id, title, sort_order, enabled)
                    VALUES (?, ?, ?, 1)
                    """,
                    (subgroup_id, record_title, record_order),
                )
                cursor.execute(
                    "SELECT id FROM Catalog_record WHERE subgroup_id = ? AND title = ?",
                    (subgroup_id, record_title),
                )
                catalog_record_ids[record_title] = cursor.fetchone()[0]

    suggestion_group_order = catalog_group_order + 100
    for suggestion in data.get("catalogSuggestions", []):
        if suggestion.get("status") != "pending" or suggestion.get("enabled") is not False:
            continue
        section_title = text_value(suggestion.get("sectionTitle")) or "Педагоги та тренери"
        group_title = text_value(suggestion.get("groupTitle"))
        record_title = text_value(suggestion.get("recordTitle"))
        if not group_title:
            continue

        group_id = first_or_create(
            cursor,
            "Catalog_groups",
            "title",
            section_title,
            {"description": "Запропоновано користувачем.", "sort_order": suggestion_group_order, "enabled": 0},
        )
        subgroup_id = first_or_create(
            cursor,
            "Catalog_subgroups",
            "title",
            group_title,
            {"group_id": group_id, "description": "Очікує затвердження", "sort_order": 999, "enabled": 0},
        )
        if record_title:
            cursor.execute(
                """
                INSERT OR IGNORE INTO Catalog_record (subgroup_id, title, sort_order, enabled)
                VALUES (?, ?, ?, 0)
                """,
                (subgroup_id, record_title, 999),
            )
            cursor.execute(
                "SELECT id FROM Catalog_record WHERE subgroup_id = ? AND title = ?",
                (subgroup_id, record_title),
            )
            catalog_record_ids[record_title] = cursor.fetchone()[0]
        suggestion_group_order += 1

    user_ids_by_name = {}
    for email in data["adminEmails"]:
        name = email.split("@")[0]
        cursor.execute(
            "INSERT INTO Users (external_id, role, name, notes) VALUES (?, 'admin', ?, ?)",
            (f"admin:{email}", name, "Адміністратор сайту"),
        )
        user_id = cursor.lastrowid
        user_ids_by_name[name] = user_id
        cursor.execute("INSERT INTO Emails (user_id, email, is_primary) VALUES (?, ?, 1)", (user_id, email))

    for item in data["specialistUsers"]:
        cursor.execute(
            """
            INSERT INTO Users (external_id, role, name, registered_at, last_active, notes)
            VALUES (?, 'specialist', ?, ?, ?, ?)
            """,
            (item.get("id"), item["name"], item.get("registeredAt"), item.get("lastActive"), item.get("notes")),
        )
        user_id = cursor.lastrowid
        user_ids_by_name[item["name"]] = user_id
        cursor.execute("INSERT INTO Phones (user_id, phone, is_primary) VALUES (?, ?, 1)", (user_id, item.get("phone")))
        cursor.execute("INSERT INTO Emails (user_id, email, is_primary) VALUES (?, ?, 1)", (user_id, item.get("email")))

    for item in data["parentUsers"]:
        cursor.execute(
            """
            INSERT INTO Users (external_id, role, name, registered_at, last_active, notes)
            VALUES (?, 'parent', ?, ?, ?, ?)
            """,
            (item.get("id"), item["name"], item.get("registeredAt"), item.get("lastActive"), item.get("notes")),
        )
        user_id = cursor.lastrowid
        user_ids_by_name[item["name"]] = user_id
        cursor.execute("INSERT INTO Phones (user_id, phone, is_primary) VALUES (?, ?, 1)", (user_id, item.get("phone")))
        cursor.execute("INSERT INTO Emails (user_id, email, is_primary) VALUES (?, ?, 1)", (user_id, item.get("email")))

    specialist_ids_by_name = {}
    for listing in data["listings"]:
        user_id = user_ids_by_name.get(listing["name"])
        city = listing.get("city") or None
        record_id = catalog_record_ids.get(listing.get("specialty"))
        cursor.execute(
            """
            INSERT INTO Specialists (
              user_id, catalog_record_id, city, name, initials, price, duration_minutes,
              rating, reviews_count, district, formats_json, nosologies_json, schedule,
              response_time, bio, education, experience, created_at, expires_at, status, notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
            """,
            (
                user_id,
                record_id,
                city,
                listing.get("name"),
                listing.get("initials"),
                listing.get("price"),
                listing.get("duration"),
                listing.get("rating"),
                listing.get("reviews"),
                listing.get("district"),
                dumps(listing.get("formats")),
                dumps(listing.get("nosologies")),
                listing.get("schedule"),
                listing.get("responseTime"),
                listing.get("bio"),
                listing.get("education"),
                listing.get("experience"),
                listing.get("createdAt"),
                listing.get("expiresAt"),
                listing.get("details"),
            ),
        )
        specialist_id = cursor.lastrowid
        specialist_ids_by_name[listing["name"]] = specialist_id
        listing_specialties = []
        for specialty in listing.get("specialties") or [listing.get("specialty")]:
            if specialty and specialty not in listing_specialties:
                listing_specialties.append(specialty)
        if listing.get("specialty") and listing.get("specialty") not in listing_specialties:
            listing_specialties.insert(0, listing.get("specialty"))
        for sort_order, specialty in enumerate(listing_specialties, start=1):
            specialist_record_id = catalog_record_ids.get(specialty)
            if specialist_record_id:
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO SpecialistRecords (
                      specialist_id, catalog_record_id, is_primary, sort_order
                    )
                    VALUES (?, ?, ?, ?)
                    """,
                    (specialist_id, specialist_record_id, 1 if sort_order == 1 else 0, sort_order),
                )
        for review in listing.get("reviewItems", []):
            author = review.get("author") or "Користувач"
            parent_user_id = user_ids_by_name.get(author)
            cursor.execute(
                """
                INSERT INTO Comments (user_id, specialist_id, body, rating, likes, dislikes, moderated, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 1, ?)
                """,
                (
                    parent_user_id,
                    specialist_id,
                    review.get("text"),
                    review.get("rating"),
                    review.get("likes", 0),
                    review.get("dislikes", 0),
                    review.get("date"),
                ),
            )

    specialty_map = {
        "speech": "Логопед",
        "psychology": "Дитячий психолог",
        "aba": "ABA-терапевт",
        "occupational": "Ерготерапевт",
        "physical": "Фізичний терапевт",
        "tutor": "Тьютор",
        "early": "Координатор раннього втручання",
        "other": "Інше",
    }
    for index, request in enumerate(data["requestData"], start=1):
        family_name = text_value(request.get("family")) or f"Родина {index}"
        user_id = user_ids_by_name.get(family_name)
        if not user_id:
            cursor.execute(
                "INSERT INTO Users (external_id, role, name, notes) VALUES (?, 'parent', ?, ?)",
                (f"request-family:{request.get('id')}", family_name, "Створено з заявки родини"),
            )
            user_id = cursor.lastrowid
            user_ids_by_name[family_name] = user_id
        city = request.get("city") or None
        record_id = catalog_record_ids.get(specialty_map.get(request.get("specialty"), "Інше"))
        cursor.execute(
            """
            INSERT INTO Requests (
              user_id, catalog_record_id, city, title, description, budget, urgent,
              available_time, formats_json, tags_json, created_at, status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
            """,
            (
                user_id,
                record_id,
                city,
                text_value(request.get("title")),
                text_value(request.get("text")),
                request.get("budget"),
                1 if request.get("urgent") else 0,
                text_value(request.get("available")),
                dumps(request.get("formats")),
                dumps(request.get("tags", {}).get("uk") if isinstance(request.get("tags"), dict) else request.get("tags")),
                request.get("createdAt"),
            ),
        )

    for item in data["moderationItems"]:
        specialist_id = specialist_ids_by_name.get(item.get("name"))
        if specialist_id and item.get("reports", 0) > 0:
            cursor.execute(
                """
                INSERT INTO Abuses (specialist_id, reason, status, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (specialist_id, item.get("message") or item.get("notes"), item.get("status", "new"), item.get("createdAt")),
            )

    for item in data["adminReviewItems"]:
        specialist_id = specialist_ids_by_name.get(item.get("specialist"))
        cursor.execute(
            """
            INSERT INTO Comments (specialist_id, body, rating, moderated, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (specialist_id, item.get("text"), item.get("rating"), 1 if item.get("moderated") else 0, item.get("date")),
        )
        comment_id = cursor.lastrowid
        if not item.get("moderated") and item.get("rating", 5) < 3:
            cursor.execute(
                "INSERT INTO Abuses (specialist_id, comment_id, reason, status, created_at) VALUES (?, ?, ?, 'review_queue', ?)",
                (specialist_id, comment_id, "Негативний рейтинг відгуку", item.get("date")),
            )

    for specialist_name, specialist_id in specialist_ids_by_name.items():
        cursor.execute(
            """
            INSERT INTO Messages (specialist_id, body, is_reply)
            VALUES (?, ?, 0)
            """,
            (specialist_id, f"Добрий день. Підкажіть, будь ласка, чи працюєте ви із запитом: {specialist_name}?"),
        )
        cursor.execute(
            """
            INSERT INTO Messages (specialist_id, body, is_reply)
            VALUES (?, ?, 1)
            """,
            (specialist_id, "Так, можу підказати маршрут і запропонувати перше вікно."),
        )

    connection.commit()
    connection.close()


if __name__ == "__main__":
    main()
