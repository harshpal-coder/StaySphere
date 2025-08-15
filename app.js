if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
console.log(process.env.SECRET_KEY)


const express = require('express'); 
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const hotelSchema = require('./schema.js');
const Review = require('./models/reviews.js');
const listingsRouter = require('./routes/listings');
const reviewsRouter = require('./routes/reviews');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user.js'); 
const userRouter = require('./routes/user');

const dburl = process.env.ATLASDB_URL;

connectDB().then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.error('Database connection error:', error);
});

async function connectDB() {
  try {
    await mongoose.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride('_method')); // Middleware to support PUT and DELETE methods
app.engine('ejs', ejsmate); // Use ejsmate for EJS rendering
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory



const store = MongoStore.create({
  mongoUrl: dburl,
  secret: process.env.SECRET,
  touchAfter: 24 * 3600 // Time period in seconds
});

store.on('error', () =>  {
  console.error('Session store error:', err);
});



const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days 
    maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7 days
    httpOnly: true
  }
};

// get the listing model
// app.get('/', (req, res) => {
//   res.send('Hello World!'); 
// });













app.use(session(sessionOptions));
app.use(flash()); // Use flash messages for notifications

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.currentUser = req.user;
  next();
});


app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);



app.listen(8080, () => {
  console.log('Server is running on port 8080');
});

