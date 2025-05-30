-- Tạo CSDL
CREATE DATABASE nutrition_db;
GO

USE nutrition_db;
GO

-- Bảng user
CREATE TABLE [user] (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100),
  email NVARCHAR(100) UNIQUE,
  password NVARCHAR(255),
  age INT,
  weight FLOAT,
  height FLOAT,
  avatarUrl NVARCHAR(255),
  gender NVARCHAR(10) NOT NULL,
  goal NVARCHAR(MAX),
  allergies NVARCHAR(MAX)
);

-- Bảng bua_an
CREATE TABLE bua_an (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES [user](id),
  date DATETIME
);

-- Bảng mon_an
CREATE TABLE mon_an (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_mon NVARCHAR(255)
);

-- Bảng mon_an_bua_an
CREATE TABLE mon_an_bua_an (
  id INT IDENTITY(1,1) PRIMARY KEY,
  bua_an_id INT FOREIGN KEY REFERENCES bua_an(id),
  mon_an_id INT FOREIGN KEY REFERENCES mon_an(id),
  quantity INT DEFAULT 1,
  custom_weight FLOAT
);

-- Bảng thong_tin_dinh_duong
CREATE TABLE thong_tin_dinh_duong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  mon_an_id INT UNIQUE FOREIGN KEY REFERENCES mon_an(id),
  calo FLOAT,
  protein FLOAT,
  carb FLOAT,
  fat FLOAT
);

-- Bảng thong_tin_dinh_duong_bua_an
CREATE TABLE thong_tin_dinh_duong_bua_an (
  id INT IDENTITY(1,1) PRIMARY KEY,
  bua_an_id INT FOREIGN KEY REFERENCES bua_an(id),
  mon_an_id INT FOREIGN KEY REFERENCES mon_an(id),
  calo FLOAT,
  protein FLOAT,
  carb FLOAT,
  fat FLOAT
);

-- Bảng lich_su_bua_an
CREATE TABLE lich_su_bua_an (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES [user](id),
  danh_sach_bua_an NVARCHAR(MAX),
  date DATETIME
);

-- Bảng lich_su_tim_kiem
CREATE TABLE lich_su_tim_kiem (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES [user](id),
  query NVARCHAR(MAX) NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);

-- Bảng ke_hoach_dinh_duong
CREATE TABLE ke_hoach_dinh_duong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES [user](id),
  goal NVARCHAR(MAX),
  calo_goal INT,
  ti_le_dinh_duong NVARCHAR(MAX)
);

-- Bảng thong_ke_dinh_duong
CREATE TABLE thong_ke_dinh_duong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES [user](id),
  date DATE,
  tong_calo_tieu_thu INT,
  tong_calo_dot INT,
  can_nang_hien_tai FLOAT,
  muc_tieu_con_lai NVARCHAR(MAX)
);

-- Bảng phan_tich_dinh_duong
CREATE TABLE phan_tich_dinh_duong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES [user](id),
  date DATE,
  do_can_bang NVARCHAR(MAX),
  ket_luan NVARCHAR(MAX)
);

-- Bảng thuc_don
CREATE TABLE thuc_don (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES [user](id),
  ten_thuc_don NVARCHAR(255),
  loai_thuc_don NVARCHAR(100),
  tong_calo INT,
  danh_sach_mon_an NVARCHAR(MAX)
);

-- Bảng mon_an_thuc_don
CREATE TABLE mon_an_thuc_don (
  thuc_don_id INT FOREIGN KEY REFERENCES thuc_don(id),
  mon_an_id INT FOREIGN KEY REFERENCES mon_an(id)
);

-- Bảng goi_y_mon_an
CREATE TABLE goi_y_mon_an (
  id INT IDENTITY(1,1) PRIMARY KEY,
  mon_an_de_xuat NVARCHAR(MAX),
  user_id INT FOREIGN KEY REFERENCES [user](id),
  mon_an_id INT FOREIGN KEY REFERENCES mon_an(id)
);

-- Bảng physical_info
CREATE TABLE physical_info (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT UNIQUE FOREIGN KEY REFERENCES [user](id),
  height DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  age INT NOT NULL,
  gender NVARCHAR(10) CHECK (gender IN ('Nam','Nữ')) NOT NULL,
  activity_level NVARCHAR(20) CHECK (activity_level IN ('Ít','Trung bình','Nhiều')) NOT NULL,
  bmi AS (weight / (height * height)) PERSISTED,
  bmi_category NVARCHAR(20),
  calorie_need INT,
  ideal_weight_min DECIMAL(5,2),
  ideal_weight_max DECIMAL(5,2),
  updated_at DATETIME DEFAULT GETDATE()
);

-- Bảng physical_info_history
CREATE TABLE physical_info_history (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES [user](id),
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  age INT,
  gender NVARCHAR(10),
  activity_level NVARCHAR(20),
  bmi DECIMAL(4,2),
  bmi_category NVARCHAR(20),
  calorie_need INT,
  ideal_weight_min DECIMAL(5,2),
  ideal_weight_max DECIMAL(5,2),
  recorded_at DATETIME DEFAULT GETDATE()
);

-- DỮ LIỆU MẪU
-- Thêm người dùng
INSERT INTO [user] (name, email, password, age, weight, height, avatarUrl, gender, goal, allergies)
VALUES
(N'TRUONG VU MINH VAN', 'sieumc1990@gmail.com', '...', 32, 51, 189, '/avatars/avatar_29.jpg', 'male', '', '');

-- Thêm món ăn
INSERT INTO mon_an (ten_mon) VALUES 
(N'Big Mac'), (N'apple');

-- Dinh dưỡng cho món
INSERT INTO thong_tin_dinh_duong (mon_an_id, calo, protein, carb, fat)
VALUES 
(1, 257, 11.82, 20.08, 14.96), -- Big Mac
(2, 52, 0.26, 13.81, 0.17);    -- Apple

-- Bữa ăn
INSERT INTO bua_an (user_id, date) VALUES (1, '2025-05-29');

-- Thêm món vào bữa ăn
INSERT INTO mon_an_bua_an (bua_an_id, mon_an_id, quantity)
VALUES (1, 1, 5);

-- Phân tích dinh dưỡng theo bữa
INSERT INTO thong_tin_dinh_duong_bua_an (bua_an_id, mon_an_id, calo, protein, carb, fat)
VALUES (1, 1, 1285, 59.1, 100.4, 74.8);

-- Lịch sử bữa ăn
INSERT INTO lich_su_bua_an (user_id, danh_sach_bua_an, date)
VALUES (1, N'[{"food_name":"big mac","quantity":5,"custom_weight":null}]', '2025-05-29');

-- Lịch sử tìm kiếm
INSERT INTO lich_su_tim_kiem (user_id, query)
VALUES 
(1, N'pho'),
(1, N'200g rice'),
(1, N'100g chicken breast raw'),
(1, N'apple'),
(1, N'100g apple');
