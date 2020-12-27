const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// enable dotenv to load environment variables
require('dotenv').config();

// use json as response
app.use(express.json());

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

  // first parameter is payload information,
  // second parameter is access_token, we currently sign it with crypto module
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  
  res.json({ accessToken: accessToken });
});

app.listen(4000);