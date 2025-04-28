-- Create database
CREATE DATABASE IF NOT EXISTS upwork_clone;
USE upwork_clone;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  account_type ENUM('client', 'freelancer', 'admin') NOT NULL,
  bio TEXT,
  skills TEXT,
  hourly_rate DECIMAL(10, 2),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10, 2),
  skills TEXT,
  duration VARCHAR(100),
  client_id INT NOT NULL,
  status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  freelancer_id INT NOT NULL,
  cover_letter TEXT NOT NULL,
  bid_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  client_id INT NOT NULL,
  freelancer_id INT NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contract_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  recipient_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id)
);

-- Sample data
INSERT INTO users (first_name, last_name, email, password, account_type, bio, skills, hourly_rate, avatar_url)
VALUES 
('John', 'Doe', 'john@example.com', '$2b$10$qQ5Sf4OWUdOlJHEL8JCg1OXVkBw5AfH5AWDR/IbAobQ4GJyEQeCiK', 'client', 'Tech company owner', NULL, NULL, NULL),
('Jane', 'Smith', 'jane@example.com', '$2b$10$qQ5Sf4OWUdOlJHEL8JCg1OXVkBw5AfH5AWDR/IbAobQ4GJyEQeCiK', 'freelancer', 'Experienced web developer', 'React, Node.js, MySQL', 45.00, NULL),
('Admin', 'User', 'admin@example.com', '$2b$10$qQ5Sf4OWUdOlJHEL8JCg1OXVkBw5AfH5AWDR/IbAobQ4GJyEQeCiK', 'admin', 'System Administrator', NULL, NULL, NULL);

INSERT INTO jobs (title, description, budget, skills, duration, client_id, status)
VALUES 
('Frontend Developer Needed', 'Looking for a React expert to build a dashboard', 2000.00, 'React, JavaScript, CSS', '2-4 weeks', 1, 'open'),
('Full Stack Web Application', 'E-commerce website with user authentication and payment integration', 5000.00, 'React, Node.js, MySQL, Stripe', '1-2 months', 1, 'open');
