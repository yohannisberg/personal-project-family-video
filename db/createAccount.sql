INSERT INTO accounts (first_name, last_name, newsletter, email, password, sessionId)
VALUES ($1, $2, FALSE, $3, $4, $5)
RETURNING *;
