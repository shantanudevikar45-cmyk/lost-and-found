-- ===================================================================
-- CampusFind MySQL Database Initialization Script
-- ===================================================================

CREATE DATABASE IF NOT EXISTS campusfind_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campusfind_db;

-- Table definition (Hibernate auto-creates and updates this table via ddl-auto=update)
-- Provided here for manual inspection or reference:
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    incident_date DATE NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(30),
    image_url VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
