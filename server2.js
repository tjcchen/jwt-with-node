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

/**
 * A JWT token looks like this:
 * {
 *   "accessToken": "
 *    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
 *    eyJuYW1lIjoiSmFja2llIiwiaWF0IjoxNjA5MDYyMTM3fQ.
 *    -gG0gRTRR44qgtrksE-Hb-J84165olLPIjbai8EOeR4
 *   "
 * }
 * 
 * the above token is delimited by ., first param is header, second param is payload,
 * third param is signature and cannot be decoded
 * 
 * first param: {"alg":"HS256","typ":"JWT"},
 * second param: {"name":"Jackie","iat":1609062137},
 * third param: -gG0gRTRR44qgtrksE-Hb-J84165olLPIjbai8EOeR4
 */
app.post('/login', (req, res) => {
  // Todo: add authenticate user code logic

  // generate access token with jwt
  const username = req.body.username;
  const user = { name: username };

  // first parameter is payload information,
  // second parameter is access_token, we currently sign it with crypto module
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  
  res.json({ accessToken: accessToken });
});

app.listen(4000);