const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 52330;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (clientReq, serverRes) => {
  serverRes.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (clientReq, serverRes) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (clientReq, serverRes) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return serverRes.status(500).json({ error: 'Error reading notes.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (clientReq, serverRes) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return serverRes.status(500).json({ error: 'Error reading notes.' });
    }

    const notes = JSON.parse(data);
    const newNote = {
      id: notes.length + 1,
      title: req.body.title,
      text: req.body.text,
    };

    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error saving note.' });
      }
      res.json(newNote);
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
