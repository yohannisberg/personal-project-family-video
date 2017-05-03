CREATE TABLE IF NOT EXISTS accounts
(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  newsletter BOOLEAN,
  email VARCHAR(50),
  password VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS shoppingCart
(
  id SERIAL PRIMARY KEY,
  movie_title VARCHAR(50),
  api_id VARCHAR(10),
  picture VARCHAR(100),
  FOREIGN KEY account_id REFERENCES accounts(id)
);
