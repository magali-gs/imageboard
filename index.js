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

app.use(express.json({
    extended: false
}));

app.use(express.static("./public"));

app.get('/images', (req, res) => {
    console.log('GET request made to /images');
    db.getImage()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error in getImage", err);
            res.json({ success: false });
        });

});

app.post("/upload", uploader.single('image'), s3.upload, (req, res) => {
    console.log('POST request made');
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
            .then(res.json(uploadedImage))
            .catch((err) => {
                console.log("Error in uploadImageDb", err);
                res.json({ success: false });
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.get("/highlighted/:imageId", (req, res) => {
    console.log("GET request made to /highlighted/:imageId");
    const { imageId } = req.params;
    db.getImageInfo(imageId)
        .then(({ rows }) => {
            rows[0].created_at = rows[0].created_at.toDateString();
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error in getImageInfo", err);
            res.json({ success: false });
        });
});

app.get("/more/:lastId", (req, res) => {
    const { lastId } = req.params;
    console.log("GET request made to /more",lastId);
    db.getMoreImages(lastId)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error in getMoreImages", err);
            res.json({ success: false });
        });
});

app.get('/comments/:imageId', (req, res) => {
    console.log("GET request made to /comments/:imageId");
    const { imageId } = req.params;
    db.getComments(imageId)
        .then(({ rows }) => {
            rows[0].created_at = rows[0].created_at.toDateString();
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error in getComments", err);
            res.json({ success: false });
        });
});

app.post("/comments", (req, res) => {
    console.log("POST request made to /comments");
    const { imageId, comment, userComment } = req.body;
    const newComment = {
        comment: comment,
        username: userComment,
        created_at: ""
    };
    db.insertComment(userComment, comment, imageId)
        .then(({ rows }) => {
            newComment.created_at = rows[0].created_at.toDateString();
            console.log(newComment);
            res.json(newComment);
        })
        .catch((err) => {
            console.log("Error in insertComment", err);
            res.json({ success: false });
        });
});


app.listen(8080, () => console.log("Imageboard up and running :)"));
