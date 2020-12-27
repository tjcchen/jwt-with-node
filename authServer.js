const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// enable dotenv to load environment variables
require('dotenv').config();

// use json as response
app.use(express.json());

// we currently store refreshTokens in memory,
// but in real world, we need to store it DB or cache
let refreshTokens = [];

/**
 * Generate access token with expire time
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    user, // payload
    process.env.ACCESS_TOKEN_SECRET, // access token secret
    {
      expiresIn: '30s' // expires time, we could have a longer expire time in real world, like 15m
    }
  );
};

/**
 * Logout logic, we need to remove current refresh token
 * 
 * TODO: access token also need to be cleared
 */
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

/**
 * Generate a new access token if refresh token is valid
 */
app.post('/token', (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    // regenerate access token
    const accessToken = generateAccessToken({ name: user.name });

    res.json({
      accessToken: accessToken
    });
  });
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
 * first param is header: {"alg":"HS256","typ":"JWT"},
 * second param is payload: {"name":"Jackie","iat":1609062137},
 * third param is signature: -gG0gRTRR44qgtrksE-Hb-J84165olLPIjbai8EOeR4
 */
app.post('/login', (req, res) => {
  // Todo: add authenticate user code logic

  // generate access token with jwt
  const username = req.body.username;
  const user = { name: username };

  // generate access token, access token only valid for 30s at this time
  const accessToken = generateAccessToken(user);

  // generate refresh token
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  // put refreshToken into refreshTokens
  refreshTokens.push(refreshToken);

  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken
  });
});

app.listen(4000);