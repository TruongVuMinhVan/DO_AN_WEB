-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 24, 2025 lúc 01:19 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

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
  `date` datetime DEFAULT NULL,
  `food_list` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `goi_y_mon_an`
--

CREATE TABLE `goi_y_mon_an` (
  `id` int(11) NOT NULL,
  `mon_an_de_xuat` text DEFAULT NULL
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
  `thoi_gian` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mon_an`
--

CREATE TABLE `mon_an` (
  `id` int(11) NOT NULL,
  `ten_mon` varchar(255) DEFAULT NULL
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
(1, 'TRUONG VU MINH VAN', 'sieumc1990@gmail.com', '123123456', 16, 55, 170, 'male', NULL, NULL),
(2, 'VO NGUYEN MINH NHAT', 'minhnhat2611@gmail.com', '123123456', 18, 100, 160, 'male', NULL, NULL),
(3, 'NGUYEN QUOC TUAN', 'quoctuan1111@gmai.com', '123123456', 19, 88, 188, 'male', NULL, NULL);

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
  ADD PRIMARY KEY (`id`);

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
-- Chỉ mục cho bảng `mon_an`
--
ALTER TABLE `mon_an`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bua_an`
--
ALTER TABLE `bua_an`
  ADD CONSTRAINT `bua_an_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
