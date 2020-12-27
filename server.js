const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// enable dotenv to load environment variables
require('dotenv').config();

// use json as response
app.use(express.json());

const posts = [
  {
    username: 'Jimmy',
    title: 'Post 1'
  },
  {
    username: 'Andy',
    title: 'Post 2'
  }
];

/**
 * A simple middleware used to retrieve jwt token and verify it, a http header with authorization looks like this:
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmFja2llIiwiaWF0IjoxNjA5MDYzNzAzfQ.H_DdgU1ymVpHFga1mOeq0ppcCPKajjvQodjaDZh86v4
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // 401 unauthorized
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // 403 forbidden
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter
    (
      post => post.username === req.user.name
    )
  );
});

app.listen(3000);