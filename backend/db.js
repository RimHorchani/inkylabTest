const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./inkyfada.db");
db.run(`CREATE TABLE IF NOT EXISTS Events (
    visitorId TEXT,
    sessionId TEXT,
    visitId TEXT,
    EventType INTEGER,
    EventValue INTEGER,
    createdAt INTEGER
  )`);

// Create the Records table
db.run(`CREATE TABLE IF NOT EXISTS Records (
    visitorId TEXT,
    sessionId TEXT,
    visitId TEXT,
    referrer TEXT,
    pageUrl TEXT,
    pageLang TEXT,
    createdAt INTEGER
  )`);
module.exports = db;
