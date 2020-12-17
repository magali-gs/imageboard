const spicedPg = require('spiced-pg');
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImage = () => {
    const q = `
    SELECT *
    FROM images
    ORDER BY id DESC
    LIMIT 9;
    `;
    return db.query(q);
};

module.exports.uploadImageDb = (url, username, title, description) => {
    const q = `
    INSERT INTO images (url, username, title, description) 
    VALUES ($1, $2, $3, $4);
    `;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getImageInfo = (imageId) => {
    const q = `
    SELECT *
    FROM images
    WHERE id = $1;
    `;
    const params = [imageId];
    return db.query(q, params);
};

module.exports.getMoreImages = (lastId) => {
    const q = `
    SELECT *, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" 
    FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 9;
    `;
    const params = [lastId];
    return db.query(q, params);
};

module.exports.getComments = (imageId) => {
    const q = `
    SELECT *
    FROM comments
    WHERE image_id = $1;
    `;
    const params = [imageId];
    return db.query(q, params);
};

module.exports.insertComment = (username, comment, image_id) => {
    const q = `
    INSERT INTO comments (username, comment, image_id)
    VALUES ($1, $2, $3);
    `;
    const params = [username, comment, image_id];
    return db.query(q, params);
};
