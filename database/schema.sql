-- Create database
CREATE DATABASE IF NOT EXISTS blogger;
USE blogger;

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  read_time VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_date (date)
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_topics junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS blog_topics (
  blog_id INT NOT NULL,
  topic_id INT NOT NULL,
  PRIMARY KEY (blog_id, topic_id),
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- Create blog_details table (one-to-one relationship)
CREATE TABLE IF NOT EXISTS blog_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blog_id INT NOT NULL UNIQUE,
  content JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO blogs (id, title, excerpt, date, category, read_time) VALUES
(1, 'Building a React Dashboard with Hooks', 'Learn how to create a dynamic dashboard using React hooks and modern patterns.', '2024-01-15', 'React', '5 min read'),
(2, 'Infrastructure as Code with Terraform', 'A comprehensive guide to managing cloud infrastructure using Terraform best practices.', '2024-01-10', 'DevOps', '8 min read'),
(3, 'Google Cloud Platform: Getting Started', 'Everything you need to know to start deploying applications on GCP.', '2024-01-05', 'Cloud', '6 min read'),
(4, 'Advanced React Patterns', 'Exploring compound components, render props, and custom hooks patterns.', '2023-12-20', 'React', '10 min read'),
(5, 'Terraform Modules: Best Practices', 'How to structure and organize your Terraform code for maximum reusability.', '2023-12-15', 'DevOps', '7 min read'),
(6, 'GCP Cloud Functions Deep Dive', 'Understanding serverless architecture with Google Cloud Functions.', '2023-12-10', 'Cloud', '9 min read'),
(7, 'React Server Components Explained', 'A detailed look at React Server Components and their benefits.', '2023-12-01', 'React', '12 min read'),
(8, 'Multi-Cloud Strategy with Terraform', 'Managing resources across AWS, Azure, and GCP with a unified approach.', '2023-11-25', 'DevOps', '15 min read'),
(9, 'Installing Redis with Docker', 'A step-by-step guide to installing and running Redis using Docker containers with best practices for data persistence and security.', '2026-02-02', 'DevOps', '10 min read');

-- Insert topics
INSERT INTO topics (name) VALUES
('React'), ('Hooks'), ('Frontend'), ('Terraform'), ('Infrastructure'), ('DevOps'),
('Google Cloud'), ('Cloud'), ('Deployment'), ('Design Patterns'), ('Best Practices'),
('Serverless'), ('Cloud Functions'), ('Server Components'), ('Next.js'), ('Multi-Cloud'),
('AWS'), ('Azure'), ('Docker'), ('Redis'), ('Containers'), ('Database');

-- Insert blog-topic relationships
INSERT INTO blog_topics (blog_id, topic_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5), (2, 6),
(3, 7), (3, 8), (3, 9),
(4, 1), (4, 10), (4, 3),
(5, 4), (5, 5), (5, 11),
(6, 7), (6, 12), (6, 13),
(7, 1), (7, 14), (7, 15),
(8, 4), (8, 16), (8, 17), (8, 18), (8, 7),
(9, 19), (9, 20), (9, 6), (9, 21), (9, 22);
