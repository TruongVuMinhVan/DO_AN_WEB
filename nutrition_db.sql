-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 29, 2025 lúc 08:57 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `nutrition_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bua_an`
--
CREATE DATABASE nutrition_db;
USE nutrition_db;

CREATE TABLE `bua_an` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bua_an`
--

INSERT INTO `bua_an` (`id`, `user_id`, `date`) VALUES
(80, 29, '2025-05-29 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `goi_y_mon_an`
--

CREATE TABLE `goi_y_mon_an` (
  `id` int(11) NOT NULL,
  `mon_an_de_xuat` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `mon_an_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ke_hoach_dinh_duong`
--

CREATE TABLE `ke_hoach_dinh_duong` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `goal` text DEFAULT NULL,
  `calo_goal` int(11) DEFAULT NULL,
  `ti_le_dinh_duong` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lich_su_bua_an`
--

CREATE TABLE `lich_su_bua_an` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `danh_sach_bua_an` text DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lich_su_bua_an`
--

INSERT INTO `lich_su_bua_an` (`id`, `user_id`, `danh_sach_bua_an`, `date`) VALUES
(28, 29, '[{\"food_name\":\"apple\",\"quantity\":2,\"custom_weight\":100}]', '2025-05-29 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lich_su_tim_kiem`
--

CREATE TABLE `lich_su_tim_kiem` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `query` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lich_su_tim_kiem`
--

INSERT INTO `lich_su_tim_kiem` (`id`, `user_id`, `query`, `created_at`) VALUES
(5, 29, 'pho', '2025-05-28 06:35:09'),
(6, 29, '200g rice', '2025-05-28 08:47:05'),
(7, 32, '100000g chicken', '2025-05-28 08:50:56'),
(8, 29, '100g chicken breast raw', '2025-05-28 16:50:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mon_an`
--

CREATE TABLE `mon_an` (
  `id` int(11) NOT NULL,
  `ten_mon` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `mon_an`
--

INSERT INTO `mon_an` (`id`, `ten_mon`) VALUES
(4, 'Orange, Raw'),
(5, 'Rice, White, Cooked'),
(6, 'Chicken Breast, Raw'),
(7, 'Egg, Whole, Raw'),
(10, 'chicken breast raw'),
(12, 'apple'),
(13, 'Big Mac'),
(14, 'Egg McMuffin'),
(16, 'Filet-O-Fish'),
(17, 'McChicken'),
(19, 'Sausage McMuffin'),
(20, 'Hotcakes'),
(21, 'Hash Browns'),
(22, 'McFlurry with M&M\'s Candies'),
(23, 'mcmuffin'),
(24, 'sausage'),
(25, 'chicken mcnuggets'),
(27, NULL),
(28, NULL),
(29, NULL),
(30, NULL),
(31, NULL),
(32, NULL),
(33, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mon_an_bua_an`
--

CREATE TABLE `mon_an_bua_an` (
  `id` int(11) NOT NULL,
  `bua_an_id` int(11) NOT NULL,
  `mon_an_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `custom_weight` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `mon_an_bua_an`
--

INSERT INTO `mon_an_bua_an` (`id`, `bua_an_id`, `mon_an_id`, `quantity`, `custom_weight`) VALUES
(96, 80, 12, 2, 100);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mon_an_thuc_don`
--

CREATE TABLE `mon_an_thuc_don` (
  `thuc_don_id` int(11) DEFAULT NULL,
  `mon_an_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phan_tich_dinh_duong`
--

CREATE TABLE `phan_tich_dinh_duong` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `do_can_bang` text DEFAULT NULL,
  `ket_luan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thong_ke_dinh_duong`
--

CREATE TABLE `thong_ke_dinh_duong` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `tong_calo_tieu_thu` int(11) DEFAULT NULL,
  `tong_calo_dot` int(11) DEFAULT NULL,
  `can_nang_hien_tai` float DEFAULT NULL,
  `muc_tieu_con_lai` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thong_tin_dinh_duong`
--

CREATE TABLE `thong_tin_dinh_duong` (
  `id` int(11) NOT NULL,
  `mon_an_id` int(11) DEFAULT NULL,
  `calo` float DEFAULT NULL,
  `protein` float DEFAULT NULL,
  `carb` float DEFAULT NULL,
  `fat` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thong_tin_dinh_duong`
--

INSERT INTO `thong_tin_dinh_duong` (`id`, `mon_an_id`, `calo`, `protein`, `carb`, `fat`) VALUES
(30, 12, 94.64, 0.47, 25.13, 0.31);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thong_tin_dinh_duong_bua_an`
--

CREATE TABLE `thong_tin_dinh_duong_bua_an` (
  `id` int(11) NOT NULL,
  `bua_an_id` int(11) DEFAULT NULL,
  `mon_an_id` int(11) DEFAULT NULL,
  `calo` float DEFAULT NULL,
  `protein` float DEFAULT NULL,
  `carb` float DEFAULT NULL,
  `fat` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thong_tin_dinh_duong_bua_an`
--

INSERT INTO `thong_tin_dinh_duong_bua_an` (`id`, `bua_an_id`, `mon_an_id`, `calo`, `protein`, `carb`, `fat`) VALUES
(17, 80, 12, 189.28, 0.94, 50.26, 0.62);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuc_don`
--

CREATE TABLE `thuc_don` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ten_thuc_don` varchar(255) DEFAULT NULL,
  `loai_thuc_don` varchar(100) DEFAULT NULL,
  `tong_calo` int(11) DEFAULT NULL,
  `danh_sach_mon_an` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `goal` text DEFAULT NULL,
  `allergies` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `age`, `weight`, `height`, `avatarUrl`, `gender`, `goal`, `allergies`) VALUES
(29, 'TRUONG VU MINH VAN', 'sieumc1990@gmail.com', '$2b$10$RwFUFSy.VyJ/0OBhGP8EN.loHGnBKUWbdLhM9UJFnDVVESWPWAk4y', 32, 51, 189, '/avatars/avatar_29.jpg', 'male', '', ''),
(30, 'VO NGUYEN MINH NHAT', 'minhnhat2611@gmail.com', '$2b$10$UsMqLI04hwDRBBIYKPHnHOtG/G9ZHxiUPF4tFpcHyPm1.YqKs1k0q', 16, 12, 13, '/avatars/default.png', 'male', NULL, NULL),
(31, 'NGUYEN QUOC TUAN', 'quoctuan333@gmail.com', '$2b$10$eXhocazmku7XrGAOtaacju91iwEApfxeJuh5ouBTh4YA2SERtKjTS', 51, 51, 51, '/avatars/default.png', 'male', NULL, NULL),
(32, 'Nguyen Quoc Tuan', 'tuannq2209@gmail.com', '$2b$10$xWEFuWFhGSVcbi/rM2uH6O1G4I57qPDGNe1rWgRbc1SAh/nvxvuWe', 22, 61, 170, '/avatars/avatar_32.jpg', 'male', NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bua_an`
--
ALTER TABLE `bua_an`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `goi_y_mon_an`
--
ALTER TABLE `goi_y_mon_an`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`),
  ADD KEY `fk_mon_an` (`mon_an_id`);

--
-- Chỉ mục cho bảng `ke_hoach_dinh_duong`
--
ALTER TABLE `ke_hoach_dinh_duong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `lich_su_bua_an`
--
ALTER TABLE `lich_su_bua_an`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `lich_su_tim_kiem`
--
ALTER TABLE `lich_su_tim_kiem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `mon_an`
--
ALTER TABLE `mon_an`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `mon_an_bua_an`
--
ALTER TABLE `mon_an_bua_an`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bua_an_id` (`bua_an_id`),
  ADD KEY `mon_an_id` (`mon_an_id`);

--
-- Chỉ mục cho bảng `mon_an_thuc_don`
--
ALTER TABLE `mon_an_thuc_don`
  ADD KEY `thuc_don_id` (`thuc_don_id`),
  ADD KEY `mon_an_id` (`mon_an_id`);

--
-- Chỉ mục cho bảng `phan_tich_dinh_duong`
--
ALTER TABLE `phan_tich_dinh_duong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `thong_ke_dinh_duong`
--
ALTER TABLE `thong_ke_dinh_duong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `thong_tin_dinh_duong`
--
ALTER TABLE `thong_tin_dinh_duong`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_mon_an` (`mon_an_id`),
  ADD KEY `mon_an_id` (`mon_an_id`);

--
-- Chỉ mục cho bảng `thong_tin_dinh_duong_bua_an`
--
ALTER TABLE `thong_tin_dinh_duong_bua_an`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bua_an_id` (`bua_an_id`),
  ADD KEY `mon_an_id` (`mon_an_id`);

--
-- Chỉ mục cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bua_an`
--
ALTER TABLE `bua_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT cho bảng `goi_y_mon_an`
--
ALTER TABLE `goi_y_mon_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `ke_hoach_dinh_duong`
--
ALTER TABLE `ke_hoach_dinh_duong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `lich_su_bua_an`
--
ALTER TABLE `lich_su_bua_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `lich_su_tim_kiem`
--
ALTER TABLE `lich_su_tim_kiem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `mon_an`
--
ALTER TABLE `mon_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `mon_an_bua_an`
--
ALTER TABLE `mon_an_bua_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT cho bảng `phan_tich_dinh_duong`
--
ALTER TABLE `phan_tich_dinh_duong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thong_ke_dinh_duong`
--
ALTER TABLE `thong_ke_dinh_duong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thong_tin_dinh_duong`
--
ALTER TABLE `thong_tin_dinh_duong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `thong_tin_dinh_duong_bua_an`
--
ALTER TABLE `thong_tin_dinh_duong_bua_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bua_an`
--
ALTER TABLE `bua_an`
  ADD CONSTRAINT `bua_an_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `goi_y_mon_an`
--
ALTER TABLE `goi_y_mon_an`
  ADD CONSTRAINT `fk_mon_an` FOREIGN KEY (`mon_an_id`) REFERENCES `mon_an` (`id`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `ke_hoach_dinh_duong`
--
ALTER TABLE `ke_hoach_dinh_duong`
  ADD CONSTRAINT `ke_hoach_dinh_duong_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `lich_su_bua_an`
--
ALTER TABLE `lich_su_bua_an`
  ADD CONSTRAINT `lich_su_bua_an_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `lich_su_tim_kiem`
--
ALTER TABLE `lich_su_tim_kiem`
  ADD CONSTRAINT `lich_su_tim_kiem_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `mon_an_bua_an`
--
ALTER TABLE `mon_an_bua_an`
  ADD CONSTRAINT `mon_an_bua_an_ibfk_1` FOREIGN KEY (`bua_an_id`) REFERENCES `bua_an` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mon_an_bua_an_ibfk_2` FOREIGN KEY (`mon_an_id`) REFERENCES `mon_an` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `mon_an_thuc_don`
--
ALTER TABLE `mon_an_thuc_don`
  ADD CONSTRAINT `mon_an_thuc_don_ibfk_1` FOREIGN KEY (`thuc_don_id`) REFERENCES `thuc_don` (`id`),
  ADD CONSTRAINT `mon_an_thuc_don_ibfk_2` FOREIGN KEY (`mon_an_id`) REFERENCES `mon_an` (`id`);

--
-- Các ràng buộc cho bảng `phan_tich_dinh_duong`
--
ALTER TABLE `phan_tich_dinh_duong`
  ADD CONSTRAINT `phan_tich_dinh_duong_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `thong_ke_dinh_duong`
--
ALTER TABLE `thong_ke_dinh_duong`
  ADD CONSTRAINT `thong_ke_dinh_duong_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `thong_tin_dinh_duong`
--
ALTER TABLE `thong_tin_dinh_duong`
  ADD CONSTRAINT `thong_tin_dinh_duong_ibfk_1` FOREIGN KEY (`mon_an_id`) REFERENCES `mon_an` (`id`);

--
-- Các ràng buộc cho bảng `thong_tin_dinh_duong_bua_an`
--
ALTER TABLE `thong_tin_dinh_duong_bua_an`
  ADD CONSTRAINT `thong_tin_dinh_duong_bua_an_ibfk_1` FOREIGN KEY (`bua_an_id`) REFERENCES `bua_an` (`id`),
  ADD CONSTRAINT `thong_tin_dinh_duong_bua_an_ibfk_2` FOREIGN KEY (`mon_an_id`) REFERENCES `mon_an` (`id`);

--
-- Các ràng buộc cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  ADD CONSTRAINT `thuc_don_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
