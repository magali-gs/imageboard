const spicedPg = require('spiced-pg');
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImage = () => {
    const q = `
    SELECT *
    FROM images
    ORDER BY created_at
    LIMIT 6
    ;
    `;
    return db.query(q);
};