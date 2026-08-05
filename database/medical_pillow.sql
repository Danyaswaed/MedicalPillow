-- Create Database
CREATE DATABASE IF NOT EXISTS medical_pillow;

USE medical_pillow;


-- =========================
-- USERS TABLE
-- =========================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer','admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================
-- DOCTOR TABLE
-- =========================

CREATE TABLE doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    experience INT,
    biography TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================
-- PRODUCTS TABLE
-- =========================

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    weight DECIMAL(5,2),
    warranty VARCHAR(100),
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================
-- PRODUCT IMAGES TABLE
-- =========================

CREATE TABLE product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,

    FOREIGN KEY (product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE
);



-- =========================
-- ORDERS TABLE
-- =========================

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    total_price DECIMAL(10,2) NOT NULL,

    delivery_method ENUM('pickup','delivery') NOT NULL,

    delivery_address VARCHAR(255),

    city VARCHAR(100),

    postal_code VARCHAR(20),

    status ENUM(
        'Pending',
        'Paid',
        'Preparing',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) DEFAULT 'Pending',

    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);



-- =========================
-- ORDER ITEMS TABLE
-- =========================

CREATE TABLE order_items (

    order_item_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT NOT NULL,

    price DECIMAL(10,2) NOT NULL,


    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE,


    FOREIGN KEY (product_id)
    REFERENCES products(product_id)

);



-- =========================
-- PAYMENTS TABLE
-- =========================

CREATE TABLE payments (

    payment_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    payment_method ENUM(
        'Credit Card',
        'PayPal',
        'Apple Pay',
        'Google Pay'
    ) NOT NULL,


    payment_status ENUM(
        'Pending',
        'Paid',
        'Failed'
    ) DEFAULT 'Pending',


    transaction_id VARCHAR(255),

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(order_id)
    REFERENCES orders(order_id)

);



-- =========================
-- REVIEWS TABLE
-- =========================

CREATE TABLE reviews (

    review_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    product_id INT NOT NULL,

    rating INT CHECK(rating BETWEEN 1 AND 5),

    comment TEXT,

    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(user_id)
    REFERENCES users(user_id),


    FOREIGN KEY(product_id)
    REFERENCES products(product_id)

);



-- =========================
-- ORDER TRACKING TABLE
-- =========================

CREATE TABLE order_tracking (

    tracking_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,


    status ENUM(
        'Pending',
        'Paid',
        'Preparing',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) NOT NULL,


    notes TEXT,


    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE

);



-- =========================
-- CONTACT MESSAGES TABLE
-- =========================

CREATE TABLE contact_messages (

    message_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL,

    phone VARCHAR(20),

    subject VARCHAR(200),

    message TEXT NOT NULL,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =========================
-- TEST DATA
-- =========================


-- Admin Account
INSERT INTO users
(first_name,last_name,email,phone,password,role)
VALUES
('Doctor','Admin','admin@gmail.com','0500000000','123456','admin');



-- Doctor Info
INSERT INTO doctor
(full_name,specialization,experience,biography,image)
VALUES
(
'Dr. Example Name',
'Physiotherapy',
15,
'Physiotherapist specialized in neck and spine health.',
'doctor.jpg'
);



-- Pillow Product
INSERT INTO products
(name,description,price,stock,weight,warranty,image)
VALUES
(
'Medical Pillow',
'Ergonomic medical pillow designed by a physiotherapist.',
299.99,
100,
1.20,
'1 Year Warranty',
'pillow.jpg'
);