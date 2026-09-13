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
