# Download(extract) or fork the repo

# Open workbench and create the given database

CREATE DATABASE IF NOT EXISTS art_gallery;
USE art_gallery;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  phone VARCHAR(10) NOT NULL,
  role ENUM('viewer', 'artist', 'admin') NOT NULL
);


CREATE TABLE artworks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    artist_id INT NOT NULL,
    type ENUM('Painting', 'Sculpture', 'Sketch', 'Abstract') NOT NULL,
    medium VARCHAR(100),
    dimensions VARCHAR(100),
    image_url VARCHAR(255),
    year INT,
    price DECIMAL(10, 2),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_sold BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (artist_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  artwork_id INT,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE ON UPDATE CASCADE
);


# open your code editor (downlaoded folder)
open .env.local file and change the password
# and run following commands in terminal of (vscode)
npm install     (only one time)
npm run dev     (for starting your website)

# and then go to http://localhost:3000/
