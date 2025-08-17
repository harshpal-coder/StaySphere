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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user.js');
const userRouter = require('./routes/user');

const dburl = process.env.ATLASDB_URL;


const MONGO_URL = "mongodb://127.0.0.1:27017/hotel";


connectDB().then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.error('Database connection error:', error);
});

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL, {
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
  mongoUrl: MONGO_URL,
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


// Make currentUser and flash messages available in all views (must be before all routes)

// Ensure session and flash middleware are registered first
app.use(session(sessionOptions));
app.use(flash());

// Make currentUser and flash messages available in all views (must be after session and flash, before all routes)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.currentUser = req.user;
  next();
});

// Home page route
app.get('/', (req, res) => {
  res.render('home');
});













app.use(session(sessionOptions));
app.use(flash()); // Use flash messages for notifications


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Try to find user by googleId
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // If not found, try to find by email
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        await user.save();
      } else {
        // Create new user
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id
        });
        await user.save();
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));





// Make currentUser and flash messages available in all views
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

