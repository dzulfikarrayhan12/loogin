const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'users.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
  } else {
    console.log('Connected to SQLite DB');
  }
});

db.serialize(() => {
  // Buat tabel user jika belum ada
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // Cek apakah user admin sudah ada, kalau belum buat admin default
  db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
    if (err) {
      console.error('Error cek user admin:', err.message);
      return;
    }
    if (!row) {
      const defaultAdminPass = 'adminpass'; // Ganti password admin default di sini
      db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['admin', defaultAdminPass], function(err) {
        if (err) {
          console.error('Gagal buat user admin default:', err.message);
        } else {
          console.log(`User admin default dibuat dengan ID ${this.lastID}`);
        }
      });
    } else {
      console.log('User admin sudah ada di database.');
    }
  });
});

module.exports = db;
