const notes = require("express").Router();
const fs = require("fs");
const util = require("util");

fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);

// Not perfect, but chance of colision is 1 in a billion, right?
function randID(){
    return Math.floor(Math.random() * 1000000000);
}

notes.get("/notes", (req, res) => {
    console.log("Getting...")
    fs.readFile("./db/db.json")
        .then((data) => res.json(JSON.parse(data)));
});

notes.post("/notes", (req, res) => {
    console.log("Posting...")
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

notes.delete("/notes/:id", (req, res) => {
    console.log("Deleting...")
    let id = req.params.id;
    console.log(id);
    fs.readFile("./db/db.json")
        .then((data) => {
            db = JSON.parse(data);
            index = db.findIndex((note) => note.id == id); //Double equals because note.id is string
            console.log(index);
            if(index < 0){ // ID not found
                res.status(404).json(index);
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