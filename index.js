const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require('passport');
// const OpenIDStrategy = require('passport-openid').Strategy;
const BearerStrategy = require('jsonwebtoken').Strategy;
const app = express();

const users = require('./api/User');
const User = mongoose.model("users");

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/api/users', users);

// Connect to mongodb
mongoose
  .connect(
    "mongodb+srv://test:test@cluster0-8s3qp.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// passport.use(new OpenIDStrategy({
//     returnURL: 'http://www.example.com/auth/openid/return',
//     realm: 'http://www.example.com/'
//   },
//   function(identifier, done) {
//     User.findOrCreate({ openId: identifier }, function(err, user) {
//       done(err, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//     done(null, user.identifier);
//   });

//   passport.deserializeUser(function(identifier, done) {
//     done(null, { identifier: identifier });
//   });

// passport.use(new BearerStrategy(
//     function (token, done) {
//         User.findOne({ token: token }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             return done(null, user, { scope: 'all' });
//         });
//     }
// ));


const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// app.post('/auth/openid', passport.authenticate('openid'),
//     function (req, res) {
//         res.redirect('/');
//     });

// app.get('/auth/openid/return',
//     passport.authenticate('openid', { failureRedirect: '/login' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });

app.get('/profile',
    // passport.authenticate('bearer', { session: false }),
    function (req, res) {
        res.json(req.user);
    });





