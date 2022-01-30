const notes = require("express").Router();
const fs = require("fs");
const util = require("util");

fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);

/**
 * Generates a random numeric id. Not perfect, but chance of 
 * colision is 1 in a billion, right?
 * @returns {number} a random number between 1 and a billion.
 */
function randID(){
    return Math.floor(Math.random() * 1000000000);
}

/**
 * Get all notes stored in the "db", as an array of objects with
 * fields title, text and id.
 */
notes.get("/notes", (req, res) => {
    fs.readFile("./db/db.json")
        .then((data) => res.json(JSON.parse(data)));
});

/**
 * Writes a new note to the ""db"". Returns the note written
 * as the body of the response, with its new ID.
 */
notes.post("/notes", (req, res) => {
    fs.readFile("./db/db.json")
        .then((data) => {
            let note = {
                title: req.body.title,
                text: req.body.text,
                id: randID()
            };
            db = JSON.parse(data);
            db.push(note);
            fs.writeFile("./db/db.json", JSON.stringify(db))
                .then(res.json(note))
                .catch((err) => {
                    console.error(err)
                    res.status(500).json("Fatality")
                });
        });
});

/**
 * Removes a note from the """db""", if there is a note with the given id.
 */
notes.delete("/notes/:id", (req, res) => {
    let id = req.params.id;
    fs.readFile("./db/db.json")
        .then((data) => {
            db = JSON.parse(data);
            index = db.findIndex((note) => note.id == id); //Double equals because note.id is string
            if(index < 0){ // ID not found
                res.status(404).json(`${id} was not found.`);
            }else{
                db.splice(index, 1);
                fs.writeFile("./db/db.json", JSON.stringify(db))
                    .then(res.status(200).json("Success"))
                    .catch((err) => {
                        console.error(err)
                        res.status(500).json("Fatality")
                    });
            }
        });
});

module.exports = notes;