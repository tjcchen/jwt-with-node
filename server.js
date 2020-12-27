const express = require('express');
const app = express();

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

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.listen(3000);