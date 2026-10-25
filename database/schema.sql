PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS Abuses;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Requests;
DROP TABLE IF EXISTS SpecialistRecords;
DROP TABLE IF EXISTS Districts;
DROP TABLE IF EXISTS Specialists;
DROP TABLE IF EXISTS CatalogSuggestions;
DROP TABLE IF EXISTS Catalog_record;
DROP TABLE IF EXISTS Catalog_subgroups;
DROP TABLE IF EXISTS Catalog_groups;
DROP TABLE IF EXISTS UserCredentials;
DROP TABLE IF EXISTS Admins;
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
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  registered_at TEXT,
  last_active TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX uq_emails_email_nocase ON Emails(lower(email));
CREATE INDEX idx_emails_user_id ON Emails(user_id);

CREATE TABLE GoogleId (
  user_id INTEGER NOT NULL,
  external_id TEXT NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE INDEX idx_google_id_user_id ON GoogleId(user_id);

CREATE TABLE Phones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  phone TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Admins (
  user_id INTEGER PRIMARY KEY,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

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

CREATE TABLE CatalogSuggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  group_id INTEGER NOT NULL,
  group_title TEXT NOT NULL,
  record_title TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by INTEGER,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES Catalog_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE Specialists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  city TEXT,
  price INTEGER,
  duration_minutes INTEGER,
  rating REAL,
  reviews_count INTEGER DEFAULT 0,
  online INTEGER NOT NULL DEFAULT 0 CHECK (online IN (0, 1)),
  bio TEXT,
  education TEXT,
  experience INTEGER,
  created_at TEXT,
  expires_at TEXT,
  status TEXT DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Districts (
  specialist_id INTEGER NOT NULL,
  district_id TEXT NOT NULL,
  client_site INTEGER NOT NULL DEFAULT 0 CHECK (client_site IN (0, 1)),
  PRIMARY KEY (specialist_id, district_id, client_site),
  FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE,
  FOREIGN KEY (district_id) REFERENCES entries(l5_parent_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_districts_district_id ON Districts(district_id);

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
