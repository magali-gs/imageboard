DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    comment TEXT,
    image_id INTEGER UNIQUE NOT NULL REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT conname
FROM pg_constraint
WHERE conrelid = 'comments'::regclass
  AND contype = 'u';

  ALTER TABLE comments DROP CONSTRAINT comments_image_id_key;
