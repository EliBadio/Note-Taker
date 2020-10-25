const express = require('express');
const path = require('path');
const fs = require('fs');

// Init express app
const app = express();
const PORT = process.env.PORT || 3000

// Middleware
// middleware to load static files (css etc..)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

// HTML routes
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});


// API routes
app.get('/api/notes', (req,res) => {
    // read db file
    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    res.json(savedNotes)
});

app.post('/api/notes', (req,res) => {
    // Get inputed data from req.body
    const newNote = req.body;

    // Retrieve data from data
    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))

    // Add new note to db
    newNote.id = savedNotes.length;
    savedNotes.push(newNote);

    // update db with new data
    fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes))

    // return new note
    res.json(newNote);

    console.log('Note successfully saved')

    console.log(newNote)
});

app.delete('/api/notes/:id', (req,res) => {
    // Get id from params
    let id = req.params.id;

    // Retrieve data from db
    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    // Remove note with the params id
    savedNotes = savedNotes.filter(note => note.id != id);

    // rewrite db
    fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));

    //return db
    res.json(savedNotes);

    console.log(`Note with id ${id} successfully deleted`)
})

// HTML route
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

const PORT = process.env.PORT || 3000
// Listen to server
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))