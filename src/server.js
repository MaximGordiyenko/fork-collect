const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const ProfileController = require('./controllers/profile');
const LogoutController = require('./controllers/logout');
const SignupController = require('./controllers/signup');
const LoginController = require('./controllers/login');
const ForkController = require('./controllers/forks');
const User = require('./models/users');
const Fork = require('./models/fork');

const app = express();
const MongoStore = connectMongo(session);
const database = require('./database');
database.db();

const envConfig = dotenv.config();
if (envConfig.error) {
  console.log('.env file does not loaded');
  throw envConfig.error;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));

const loggerMiddleWare = async (req, res, next) => {
  try {
    let user = await User.findById(req.session.userId);
    console.log('current user id:', user._id || 'unauthorized');
  } catch (err) {
    console.log('current user id:', 'unauthorized');
    
  }
  next();
};

// START
app.set('views', __dirname + '/view');
app.set('view engine', 'jsx');
let options = { beautify: true };
app.engine('jsx', require('express-react-views').createEngine(options));
app.get('/users', pagination(Fork), (req, res) => {
  res.render('index.jsx', { forks: res.json(res.pagination) });
});

function pagination(model) {
  return async (req, res, next) => {
    
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = ((page - 1) * limit);
    const endIndex = page * limit;
    
    let resultsAll = {};
    if (endIndex < await model.countDocuments().exec()) {
      resultsAll.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      resultsAll.prev = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      resultsAll.results = await model.find({}).limit(limit).skip(startIndex).exec();
      console.log('result pagination', resultsAll);
      res.pagination = resultsAll;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

// END
app.use(express.static('src/view/public'));
app.use('/forks', loggerMiddleWare, express.static('src/view/forks'));

app.post('/login', loggerMiddleWare, LoginController);
app.post('/signup', loggerMiddleWare, SignupController);
app.get('/logout', loggerMiddleWare, LogoutController);
app.get('/profile', loggerMiddleWare, ProfileController);
app.use('/fork', loggerMiddleWare, ForkController);

app.listen(process.env.NODE_PORT, () => console.log(`fork server running on port: ${process.env.NODE_PORT}`));
