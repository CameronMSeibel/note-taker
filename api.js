const notes = require("express").Router();
const fs = require("fs");
const util = require("util");

fs.readFile = util.promisify(fs.readFile);

notes.get("/notes", (req, res) => {
    fs.readFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

notes.post("/notes", (req, res) => {

});

module.exports = notes;