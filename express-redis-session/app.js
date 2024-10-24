const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();

const redisClient = redis.createClient();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 10 },
  })
);

app.set('view engine', 'ejs');
app.set('views', './views');

const users = [
  {
    id: 1,
    username: 'user1',
    password: bcrypt.hashSync('password1', 8),
  },
];

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.render('index', { username: req.session.username });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login', { message: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (user) {
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (passwordValid) {
      req.session.userId = user.id;
      req.session.username = user.username;
      return res.redirect('/');
    }
  }
  res.render('login', { message: 'Invalid credentials' });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
