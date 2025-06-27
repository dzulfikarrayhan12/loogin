const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

// Setup view engine dan folder views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Halaman login & register
app.get('/', (req, res) => {
  res.render('index', { message: null });
});

// Proses login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('index', { message: 'Username dan password diperlukan.' });
  }

  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      console.error('Error saat login:', err.message);
      return res.render('index', { message: 'Kesalahan server.' });
    }
    if (row) {
      if (username === 'admin') {
        return res.redirect('/admin');
      } else {
        return res.render('index', { message: `Selamat datang kembali, ${username}!` });
      }
    } else {
      return res.render('index', { message: 'Username atau password salah.' });
    }
  });
});

// Proses register
app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.render('index', { message: 'Semua field wajib diisi.' });
  }
  if (password !== confirmPassword) {
    return res.render('index', { message: 'Password dan konfirmasi tidak sama.' });
  }

  // Cek apakah username sudah ada
  const sqlCheck = `SELECT * FROM users WHERE username = ?`;
  db.get(sqlCheck, [username], (err, row) => {
    if (err) {
      console.error('Error cek user saat register:', err.message);
      return res.render('index', { message: 'Kesalahan server.' });
    }
    if (row) {
      return res.render('index', { message: 'Username sudah terdaftar.' });
    }

    // Insert user baru
    const sqlInsert = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(sqlInsert, [username, password], function(err) {
      if (err) {
        console.error('Gagal simpan user:', err.message);
        return res.render('index', { message: 'Gagal menyimpan data.' });
      }
      console.log(`User baru terdaftar dengan ID ${this.lastID}`);
      return res.render('index', { message: 'Registrasi berhasil, silakan login.' });
    });
  });
});

// Halaman admin: tampilkan semua user
app.get('/admin', (req, res) => {
  const sql = `SELECT id, username FROM users ORDER BY id DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error load users admin:', err.message);
      return res.send('Kesalahan server.');
    }
    console.log('Users loaded for admin:', rows);  // Debug: tampilkan user apa saja yg diambil
    res.render('admin', { users: rows });
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
