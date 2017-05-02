CREATE TABLE accounts
(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  newsletter BOOLEAN,
  email VARCHAR(50),
  password INTEGER
);

CREATE TABLE shoppingCart
(
  id SERIAL PRIMARY KEY,
  
);
