const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function saveBooking(obj){
  let arr = [];
  if (fs.existsSync(BOOKINGS_FILE)) {
    try { arr = JSON.parse(fs.readFileSync(BOOKINGS_FILE)); } catch(e){ arr = []; }
  }
  arr.unshift({ ...obj, createdAt: new Date().toISOString() });
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(arr, null, 2));
}

app.get('/', (req, res) => {
  res.render('index', { title: 'Kumaran Holidays' });
});

app.post('/book', (req, res) => {
  const { name, email, phone, destination, date, pax } = req.body;
  if (!name || !email || !destination) return res.status(400).send('Missing fields');
  saveBooking({ name, email, phone: phone || '-', destination, date: date || '-', pax: pax || 1 });
  res.render('success', { name, destination, date, pax });
});

app.get('/admin/bookings', (req, res) => {
  let arr = [];
  if (fs.existsSync(BOOKINGS_FILE)) {
    try { arr = JSON.parse(fs.readFileSync(BOOKINGS_FILE)); } catch(e){ arr = []; }
  }
  res.render('bookings', { bookings: arr });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kumaran Holidays listening on ${PORT}`));
