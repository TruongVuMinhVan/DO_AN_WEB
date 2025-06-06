-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 06, 2025 lúc 04:45 PM
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

CREATE TABLE `bua_an` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bua_an`
--

INSERT INTO `bua_an` (`id`, `user_id`, `date`) VALUES
(93, 29, '2025-06-06 00:00:00');

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
  `calo_goal` int(11) DEFAULT NULL,
  `protein_goal` float DEFAULT NULL,
  `carb_goal` float DEFAULT NULL,
  `fat_goal` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ke_hoach_dinh_duong`
--

INSERT INTO `ke_hoach_dinh_duong` (`id`, `user_id`, `calo_goal`, `protein_goal`, `carb_goal`, `fat_goal`) VALUES
(5, 29, 1730, 122, 173, 61);

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
(41, 29, '[{\"food_name\":\"apple\",\"quantity\":35,\"custom_weight\":500}]', '2025-06-06 00:00:00');

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
(11, 29, 'apple', '2025-06-06 02:28:08');

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
(13, 'Big Mac'),
(14, 'Egg McMuffin'),
(16, 'Filet-O-Fish'),
(17, 'McChicken'),
(19, 'Sausage McMuffin'),
(20, 'Hotcakes'),
(21, 'Hash Browns'),
(22, 'McFlurry with M&M\'s Candies'),
(23, 'mcmuffin'),
(25, 'chicken mcnuggets'),
(39, 'apple');

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
(288, 93, 39, 35, 500);

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
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `detail` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `detail`, `is_read`, `created_at`) VALUES
(64, 29, 'Your meal exceeds your nutrition goals!', '• Calories: 9100 kcal > 1730 kcal\n• Carbs: 2416.75 g > 173 g\n• Protein ratio: 2% (Recommended 10‒35%)\n• Carbs ratio: 100% (Recommended 45‒65%)\n• Fat ratio: 3% (Recommended 20‒35%)', 1, '2025-06-06 14:35:29'),
(65, 29, 'Your nutrition goals have been updated.', NULL, 1, '2025-06-06 14:37:53'),
(66, 29, 'Nutrition goal updated', 'Target of day:\n• Calories: 1730 kcal\n• Protein: 122 g\n• Carbs: 173 g\n• Fat: 61 g', 1, '2025-06-06 14:37:53');

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
-- Cấu trúc bảng cho bảng `physical_info`
--

CREATE TABLE `physical_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `height` decimal(5,2) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('Nam','Nữ') NOT NULL,
  `activity_level` enum('Ít','Trung bình','Nhiều') NOT NULL,
  `bmi` decimal(4,2) GENERATED ALWAYS AS (`weight` / (`height` * `height`)) STORED,
  `bmi_category` enum('Thiếu cân','Bình thường','Thừa cân','Béo phì') DEFAULT NULL,
  `calorie_need` int(11) DEFAULT NULL,
  `ideal_weight_min` decimal(5,2) DEFAULT NULL,
  `ideal_weight_max` decimal(5,2) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `physical_info_history`
--

CREATE TABLE `physical_info_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `height` decimal(5,2) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('Nam','Nữ') NOT NULL,
  `activity_level` enum('Ít','Trung bình','Nhiều') NOT NULL,
  `bmi` decimal(4,2) NOT NULL,
  `bmi_category` enum('Thiếu cân','Bình thường','Thừa cân','Béo phì') DEFAULT NULL,
  `calorie_need` int(11) NOT NULL,
  `ideal_weight_min` decimal(5,2) DEFAULT NULL,
  `ideal_weight_max` decimal(5,2) DEFAULT NULL,
  `recorded_at` datetime DEFAULT current_timestamp()
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
(45, 39, 52, 0.26, 13.81, 0.17);

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
(188, 93, 39, 9100, 45.5, 2416.75, 29.75);

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
  `goal` enum('lose','maintain','gain') NOT NULL,
  `activity_level` enum('sedentary','light','moderate','active','very_active') DEFAULT 'light'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `age`, `weight`, `height`, `avatarUrl`, `gender`, `goal`, `activity_level`) VALUES
(29, 'TRUONG VU MINH VAN', 'sieumc1990@gmail.com', '$2b$10$RwFUFSy.VyJ/0OBhGP8EN.loHGnBKUWbdLhM9UJFnDVVESWPWAk4y', 20, 61, 189, '/avatars/avatar_29.jpg', 'male', 'lose', 'sedentary'),
(33, 'NGUYEN QUOC TUAN', 'demo@example.com', '$2b$10$PQQlm6sIzIByXOLqMF9PKOrSqC.9A8S2wjexshjHnU3ghr..hGCzy', 12, 12, 12, '/avatars/default.png', 'male', 'lose', 'light'),
(34, 'Nguyen Quoc Tuan', 'tuannq209@gmail.com', '$2b$10$/29w49EH4dS6U2D3ReFSaO/cSAHdJRLnrI5CfmBsivs8MFO4Zrngq', 12, 12, 12, '/avatars/default.png', 'male', 'lose', 'light');

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
  ADD UNIQUE KEY `unique_user` (`user_id`),
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
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `phan_tich_dinh_duong`
--
ALTER TABLE `phan_tich_dinh_duong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `physical_info`
--
ALTER TABLE `physical_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `physical_info_history`
--
ALTER TABLE `physical_info_history`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT cho bảng `goi_y_mon_an`
--
ALTER TABLE `goi_y_mon_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `ke_hoach_dinh_duong`
--
ALTER TABLE `ke_hoach_dinh_duong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT cho bảng `lich_su_bua_an`
--
ALTER TABLE `lich_su_bua_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT cho bảng `lich_su_tim_kiem`
--
ALTER TABLE `lich_su_tim_kiem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `mon_an`
--
ALTER TABLE `mon_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `mon_an_bua_an`
--
ALTER TABLE `mon_an_bua_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=289;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT cho bảng `phan_tich_dinh_duong`
--
ALTER TABLE `phan_tich_dinh_duong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `physical_info`
--
ALTER TABLE `physical_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `physical_info_history`
--
ALTER TABLE `physical_info_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `thong_ke_dinh_duong`
--
ALTER TABLE `thong_ke_dinh_duong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thong_tin_dinh_duong`
--
ALTER TABLE `thong_tin_dinh_duong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT cho bảng `thong_tin_dinh_duong_bua_an`
--
ALTER TABLE `thong_tin_dinh_duong_bua_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- AUTO_INCREMENT cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `phan_tich_dinh_duong`
--
ALTER TABLE `phan_tich_dinh_duong`
  ADD CONSTRAINT `phan_tich_dinh_duong_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `physical_info`
--
ALTER TABLE `physical_info`
  ADD CONSTRAINT `physical_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `physical_info_history`
--
ALTER TABLE `physical_info_history`
  ADD CONSTRAINT `physical_info_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

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
