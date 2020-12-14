const express = require("express");
const app = express();
const db = require('./db');

app.use(express.static("public"));

app.get('/images', (req, res) => {
    db.getImage().then(({ rows }) => {
        console.log('rows', rows);
        res.json(rows);
    });
});

app.listen(8080, () => console.log("Imageboard up and running :)"));
