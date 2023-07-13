const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (clientReq, serverRes) => {
  serverRes.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (clientReq, serverRes) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      console.error(err);
      return serverRes.status(500).json({ error: 'Error reading notes.' });
    }
    const notes = JSON.parse(data);
    serverRes.json(notes);
  });
});

app.post('/api/notes', (clientReq, serverRes) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      console.error(err);
      return serverRes.status(500).json({ error: 'Error reading notes.' });
    }

    const notes = JSON.parse(data);
    const newNote = {
      id: notes.length + 1,
      title: clientReq.body.title,
      text: clientReq.body.text,
    };

    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return serverRes.status(500).json({ error: 'Error saving note.' });
      }
      serverRes.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (clientReq, serverRes) => {
  const noteId = clientReq.params.id;
console.log(noteId);
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return serverRes.status(500).json({ error: 'Error reading notes.' });
    }
    console.log(noteId);

    const notes = JSON.parse(data);

    // Find the note with the given ID
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      return serverRes.status(404).json({ error: 'Note not found.' });
    }

    // Remove the note from the array
    notes.splice(noteIndex, 1);

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return serverRes.status(500).json({ error: 'Error deleting note.' });
      }

      serverRes.sendStatus(204);
    });
  });
});

// Generate a unique ID for a new note (You can use any unique ID generation method here)
function generateUniqueId() {
  return Date.now().toString();
}

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
