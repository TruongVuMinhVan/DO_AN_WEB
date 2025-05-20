CREATE DATABASE IF NOT EXISTS nutrition_db;
USE nutrition_db;
DROP TABLE IF EXISTS mon_an_thuc_don;
DROP TABLE IF EXISTS mon_an_bua_an;
DROP TABLE IF EXISTS thong_tin_dinh_duong;
DROP TABLE IF EXISTS phan_tich_dinh_duong;
DROP TABLE IF EXISTS thong_ke_dinh_duong;
DROP TABLE IF EXISTS lich_su_tim_kiem;
DROP TABLE IF EXISTS lich_su_bua_an;
DROP TABLE IF EXISTS ke_hoach_dinh_duong;
DROP TABLE IF EXISTS goi_y_mon_an;
DROP TABLE IF EXISTS bua_an;
DROP TABLE IF EXISTS thuc_don;
DROP TABLE IF EXISTS mon_an;
DROP TABLE IF EXISTS user;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `bua_an` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `food_list` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `goi_y_mon_an` (
  `id` int(11) NOT NULL,
  `mon_an_de_xuat` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `mon_an_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `ke_hoach_dinh_duong` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `goal` text DEFAULT NULL,
  `calo_goal` int(11) DEFAULT NULL,
  `ti_le_dinh_duong` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `lich_su_bua_an` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `danh_sach_bua_an` text DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `lich_su_tim_kiem` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `query` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `lich_su_tim_kiem` (`id`, `user_id`, `query`, `created_at`) VALUES
(66, 29, '3 apple', '2025-05-06 11:37:39'),
(67, 29, '3 orange', '2025-05-06 11:40:03'),
(68, 29, '3 orange', '2025-05-06 11:40:03'),
(71, 29, '3 orange', '2025-05-06 12:36:20'),
(72, 29, '3 orange', '2025-05-06 12:36:21'),
(73, 29, '1 watermelon', '2025-05-06 12:43:11');



CREATE TABLE `mon_an` (
  `id` int(11) NOT NULL,
  `ten_mon` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `mon_an_bua_an` (
  `bua_an_id` int(11) DEFAULT NULL,
  `mon_an_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `calo` int(11) DEFAULT NULL,
  `protein` float DEFAULT NULL,
  `carb` float DEFAULT NULL,
  `fat` float DEFAULT NULL,
  `vitamin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `gender` enum('male','female','other') NOT NULL,
  `goal` text DEFAULT NULL,
  `allergies` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `age`, `weight`, `height`, `gender`, `goal`, `allergies`) VALUES
(29, 'TRUONG VU MINH VAN', 'sieumc1990@gmail.com', '$2b$10$RwFUFSy.VyJ/0OBhGP8EN.loHGnBKUWbdLhM9UJFnDVVESWPWAk4y', 13, 13, 13, 'male', NULL, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `lich_su_tim_kiem`
--
ALTER TABLE `lich_su_tim_kiem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT cho bảng `mon_an`
--
ALTER TABLE `mon_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
  ADD CONSTRAINT `mon_an_bua_an_ibfk_1` FOREIGN KEY (`bua_an_id`) REFERENCES `bua_an` (`id`),
  ADD CONSTRAINT `mon_an_bua_an_ibfk_2` FOREIGN KEY (`mon_an_id`) REFERENCES `mon_an` (`id`);

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
-- Các ràng buộc cho bảng `thuc_don`
--
ALTER TABLE `thuc_don`
  ADD CONSTRAINT `thuc_don_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

