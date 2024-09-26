// Create web server
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const commentsPath = path.join(__dirname, 'comments.json');

// Middleware
app.use(bodyParser.json());

// GET /comments
app.get('/comments', (req, res) => {
  fs.readFile(commentsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Server error');
      return;
    }
    const comments = JSON.parse(data);
    res.send(comments);
  });
});

// POST /comments
app.post('/comments', (req, res) => {
  const comment = req.body;
  if (!comment.username || !comment.content) {
    res.status(400).send('Please include username and content');
    return;
  }
  fs.readFile(commentsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Server error');
      return;
    }
    const comments = JSON.parse(data);
    comments.push(comment);
    fs.writeFile(commentsPath, JSON.stringify(comments), err => {
      if (err) {
        res.status(500).send('Server error');
        return;
      }
      res.send('Comment added');
    });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});