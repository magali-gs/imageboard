const express = require("express");
const app = express();
const db = require('./db');
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

app.use(express.static("public"));
app.use(express.static("uploads"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(uploader.single("image"));

app.get('/images', (req, res) => {
    db.getImage().then(({ rows }) => {
        res.json(rows);
    });
});

app.post("/upload", (req, res) => {
    console.log("req.file", req.file);
    console.log("req.file.path", req.file.path);
    if(req.file) {
        res.json({
            success: true,
            // img: `"${req.file.path}"`
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, () => console.log("Imageboard up and running :)"));
