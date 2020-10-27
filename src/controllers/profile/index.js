const express = require('express');
const router = express.Router();
const User = require('../../models/users');

router.get('/profile', (req, res, next) => {
  console.log('/profile', req.session.userId);
  User.findById(req.session.userId)
    .exec((error, user) => {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          const err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          const { username, email } = user;
          return res.send(`
                  <b>username:</b>${username}<br>
                  <b>email:</b>${email}<br>
                  <a type="button" href="/logout">Logout</a>
                  <a type="button" href="/forks">forks</a>
                  `);
        }
      }
    });
});

module.exports = router;
