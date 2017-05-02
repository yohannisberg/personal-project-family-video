CREATE TABLE IF NOT EXISTS accounts
(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  newsletter BOOLEAN,
  email VARCHAR(50),
  password VARCHAR(50)
);

-- CREATE TABLE shoppingCart
-- (
--   id SERIAL PRIMARY KEY,
--
-- );
