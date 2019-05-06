// const mongoose = require("mongoose");
const User = require('../models/User');
const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();

const passport = require('passport');

const jwt = require("jsonwebtoken");

let onlineUsers = require("../data/OnlineUsers");

router.post("/register", (req, res) => {
    // 查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json('邮箱已被注册!');
        } else {
            // const avatar = gravatar.url(req.body.email, {
            //     s: '200',
            //     r: 'pg',
            //     d: 'mm'
            // });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar:"avator icon",
                password: req.body.password,
                identity: req.body.identity
            });

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;

                    newUser.password = hash;

                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
})


// @route  POST api/users/login
// @desc   返回token jwt passport
// @access public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(404).json('用户不存在!');
      }
  
      // 密码匹配
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const rule = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            identity: user.identity,
            iat: 0,
          };
          jwt.sign(rule, "secret", { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            var decoded = jwt.decode(token);
            onlineUsers.setIdOnline(decoded.id, decoded.iat);
            // user.iat = 
            res.json({
              success: true,
              token:token
            });
          });
          // res.json({msg:"success"});
        } else {
          return res.status(400).json('密码错误!');
        }
      });
    });
  });

// @route  GET api/users/current
// @desc   return current user
// @access Private
router.post(
    '/current',
    // passport.authenticate('bearer', { session: false }),
    (req, res) => {
        console.log(req.body.token);
        console.log( onlineUsers.decodeToken(req.body.token) );
        // jwt.verify(req.body.token, 'secret', function(err, decoded) {
        //     console.log(err) // bar
        //     console.log(decoded) // bar
        // });
    //   res.json({
    //     id: req.user.id,
    //     name: req.user.name,
    //     email: req.user.email,
    //     identity: req.user.identity
    //   });
    }
  );

  module.exports = router;
