const express = require('express');
const router = express.Router();
const User = require('../../models/users');

router.post('/signup', (req, res) => {
  const {username, email, pass, repass} = req.body;
  console.log('/singup:', username, email, pass, repass);
  if (!email) {
    return res.status(400).send("email is not specified");
  }
  if (pass !== repass) {
    return res.status(400).send("passwords dont match");
  }
  if (username && email && pass && repass) {
    const userData = {
      email,
      username,
      password: pass,
    };
    return User.create(userData, (error, user) => {
      if (error) {
        return res.status(400).send(`mongoDB cannot create such user, Error: ${error}`);
      } else {
        req.session.userId = user._id;
        console.log('/singup session: ', req.session.userId);
        return res.redirect('/profile'); // TODO: should be implemented
      }
    });
  }
});

module.exports = router;
