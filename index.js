const express = require("express");
const app = express();
const db = require('./db');
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require('./s3');
const { s3Url } = require('./config.json');


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

app.use(express.static("./public"));

app.get('/images', (req, res) => {
    db.getImage().then(({ rows }) => {
        res.json(rows);
    });
});

app.post("/upload", uploader.single('image'), s3.upload, (req, res) => {
    console.log('POST request made');
    console.log("req.body", req.body);
    console.log("req.file.path", req.file.filename);
    if(req.file) {
        let uploadedImage = {
            title: req.body.title,
            description: req.body.description,
            username: req.body.username,
            url: s3Url + req.file.filename,
        };
        db.uploadImageDb(
            uploadedImage.url,
            uploadedImage.username,
            uploadedImage.title,
            uploadedImage.description
        )
            .then(res.json(uploadedImage));
    } else {
        res.json({
            success: false
        });
    }
});


app.listen(8080, () => console.log("Imageboard up and running :)"));
