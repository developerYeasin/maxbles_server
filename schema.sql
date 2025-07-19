-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS maxbles_agency_db;
USE maxbles_agency_db;

-- Table for Admin Users
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Blog Posts
CREATE TABLE blog_posts (
    id VARCHAR(36) PRIMARY KEY, -- Using VARCHAR(36) for UUIDs
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    excerpt TEXT,
    content LONGTEXT, -- Use LONGTEXT for potentially large HTML content
    image VARCHAR(255), -- URL to the image
    author VARCHAR(255),
    read_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for Portfolio Items
CREATE TABLE portfolio_items (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    type VARCHAR(50), -- e.g., 'website', 'mobile-app', 'digital-marketing', 'software'
    live_url VARCHAR(255), -- Can be NULL
    github_url VARCHAR(255), -- Can be NULL
    image VARCHAR(255),
    description TEXT,
    full_content LONGTEXT,
    tags JSON, -- Store tags as a JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for Contact Messages
CREATE TABLE contact_messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Testimonials
CREATE TABLE testimonials (
    id VARCHAR(36) PRIMARY KEY, -- Using VARCHAR(36) for UUIDs
    quote TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    avatar VARCHAR(255), -- URL to the avatar image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for Logos
CREATE TABLE logos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    image_url VARCHAR(2048),
    web_url VARCHAR(2048),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);