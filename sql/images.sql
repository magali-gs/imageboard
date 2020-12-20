DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT id, username, title, 
    (SELECT id FROM images
    WHERE id > 7
    ORDER BY id
    LIMIT 1
    ) AS "next", 
    (SELECT id FROM images
    WHERE id < 7
    ORDER BY id DESC
    LIMIT 1
    ) AS "previous" 
FROM images
WHERE id = 7;
