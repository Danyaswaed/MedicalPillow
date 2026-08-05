-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2026 at 01:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medical_pillow`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `message_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Unread','Read','Answered') DEFAULT 'Unread',
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`message_id`, `name`, `email`, `phone`, `subject`, `message`, `created_at`, `status`, `is_deleted`) VALUES
(1, 'danya swaed', 'daniaswaed4@gmail.com', '0523165478', 'gjkdj', 'wowww', '2026-07-09 18:10:28', 'Answered', 1),
(2, 'danya swaed', 'daniaswaed4@gmail.com', '0523165478', 'gjkdj', 'تنترتا', '2026-07-09 18:16:55', 'Read', 1),
(3, 'danya swaed', 'daniaswaed4@gmail.com', '0523165478', 'gjkdj', 'צמל', '2026-07-24 20:42:37', 'Unread', 0);

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `doctor_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `biography` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`doctor_id`, `full_name`, `specialization`, `experience`, `biography`, `image`, `created_at`) VALUES
(1, 'Dr. Example Name', 'Physiotherapy', 15, 'Physiotherapist specialized in neck and spine health.', 'doctor.jpg', '2026-07-07 21:26:39');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `delivery_method` enum('pickup','delivery') NOT NULL,
  `payment_method` enum('cash','visa') DEFAULT 'cash',
  `delivery_address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `status` enum('Pending','Paid','Preparing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_price`, `delivery_method`, `payment_method`, `delivery_address`, `city`, `postal_code`, `status`, `order_date`) VALUES
(1, 2, 299.99, 'pickup', 'cash', '', '', '', 'Pending', '2026-07-08 13:29:07'),
(2, 2, 339.99, 'delivery', 'cash', 'jhjja', 'haiaf', '20200', 'Preparing', '2026-07-08 13:38:51'),
(3, 2, 299.99, 'pickup', 'cash', 'ap', 'שפרעם', '20200', 'Cancelled', '2026-07-08 15:51:51'),
(4, 4, 339.99, 'delivery', 'cash', 'ap', 'שפרעם', '20200', 'Pending', '2026-07-24 19:43:35'),
(5, 4, 339.99, 'delivery', 'cash', 'ap', 'שפרעם', '20200', 'Pending', '2026-07-24 19:47:55'),
(6, 4, 299.99, 'pickup', 'cash', '', '', '', 'Pending', '2026-07-24 19:52:49'),
(7, 4, 299.99, 'pickup', 'cash', '', '', '', 'Pending', '2026-07-24 20:46:03'),
(8, 4, 299.99, 'pickup', 'cash', '', '', '', 'Pending', '2026-07-27 09:02:32');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 1, 299.99),
(2, 2, 1, 1, 299.99),
(3, 3, 1, 1, 299.99),
(4, 4, 1, 1, 299.99),
(5, 5, 1, 1, 299.99),
(6, 6, 1, 1, 299.99),
(7, 7, 1, 1, 299.99),
(8, 8, 1, 1, 299.99);

-- --------------------------------------------------------

--
-- Table structure for table `order_tracking`
--

CREATE TABLE `order_tracking` (
  `tracking_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` enum('Pending','Paid','Preparing','Shipped','Delivered','Cancelled') NOT NULL,
  `notes` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_tracking`
--

INSERT INTO `order_tracking` (`tracking_id`, `order_id`, `status`, `notes`, `updated_at`) VALUES
(1, 1, 'Pending', 'Order received', '2026-07-08 13:29:07'),
(2, 2, 'Pending', 'Order received', '2026-07-08 13:38:51'),
(3, 3, 'Pending', 'Order received', '2026-07-08 15:51:51'),
(4, 3, 'Preparing', 'Order status changed to Preparing', '2026-07-24 18:56:23'),
(5, 3, 'Cancelled', 'Order status changed to Cancelled', '2026-07-24 18:56:48'),
(6, 4, 'Pending', 'Order received', '2026-07-24 19:43:35'),
(7, 5, 'Pending', 'Order received', '2026-07-24 19:47:55'),
(8, 6, 'Pending', 'Order received', '2026-07-24 19:52:49'),
(9, 7, 'Pending', 'Order received', '2026-07-24 20:46:03'),
(10, 8, 'Pending', 'Order received', '2026-07-27 09:02:32');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` enum('Credit Card','PayPal','Apple Pay','Google Pay') NOT NULL,
  `payment_status` enum('Pending','Paid','Failed') DEFAULT 'Pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `weight` decimal(5,2) DEFAULT NULL,
  `warranty` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `weight`, `warranty`, `image`, `is_active`, `created_at`) VALUES
(1, 'Medical Pillow', 'Ergonomic medical pillow designed by a physiotherapist.', 299.99, 3, 1.20, '1 Year Warranty', 'pillow.jpg', 1, '2026-07-07 21:26:39'),
(2, 'نت', 'شي', 66.00, 100, 20.00, 'شش', 'شب', 0, '2026-07-08 15:55:38');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `review_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_approved` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `user_id`, `product_id`, `rating`, `comment`, `review_date`, `is_approved`, `is_featured`, `is_deleted`) VALUES
(1, 4, 1, 4, 'מהמם', '2026-07-24 20:38:59', 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`setting_id`, `setting_key`, `setting_value`) VALUES
(1, 'delivery_price', '40'),
(2, 'site_phone', '0522418085'),
(3, 'site_email', 'daniaswaed4@gmail.com'),
(4, 'site_whatsapp', '0522418085'),
(5, 'site_address', 'ישראל'),
(6, 'site_instagram', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `phone`, `password`, `role`, `created_at`, `address`, `city`, `postal_code`) VALUES
(2, 'danya', 'swaed', 'daniaswaed4@gmail.com', '0523165478', '$2b$10$85P2KO1BDp6/ndWp7L2t1OsaKhYbe2x/s05eQO6DIUf5iB0BioBRm', 'admin', '2026-07-08 11:27:39', NULL, NULL, NULL),
(3, 'יארא', 'סואעד', 'Yarswa.1234@gmail.com', '0525052195', '$2b$10$0vhgGwG9nlURFU9ezYXNce5HDJp5PL96/lRHNfprm9TV1oLhza1FS', 'admin', '2026-07-08 11:37:21', NULL, NULL, NULL),
(4, 'Hazem', 'Habarat', 'Hazem123@gmail.com', '0525052195', '$2b$10$rr4ZcQ9QOLNcqM4DXq.9IONoW26IpxjM5yyQ6EwfiQZ8MNuSSweBe', 'customer', '2026-07-24 19:43:03', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`doctor_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_tracking`
--
ALTER TABLE `order_tracking`
  ADD PRIMARY KEY (`tracking_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `doctor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_tracking`
--
ALTER TABLE `order_tracking`
  MODIFY `tracking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `order_tracking`
--
ALTER TABLE `order_tracking`
  ADD CONSTRAINT `order_tracking_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
