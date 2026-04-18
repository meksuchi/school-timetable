-- ==========================================
-- SCHOOL TIMETABLE MANAGEMENT SYSTEM
-- MySQL Database Schema
-- ==========================================

-- Drop tables if exist (for fresh setup)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS error_log;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS timetable;
DROP TABLE IF EXISTS teacher_assignments;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS timetable_settings;
DROP TABLE IF EXISTS administrators;
DROP TABLE IF EXISTS academic_years;
DROP TABLE IF EXISTS school_info;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. SCHOOL INFO (Key-Value store for school settings)
-- ==========================================
CREATE TABLE school_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(100) NOT NULL UNIQUE,
    `value` TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. ACADEMIC YEARS
-- ==========================================
CREATE TABLE academic_years (
    id VARCHAR(36) PRIMARY KEY,
    year INT NOT NULL,
    semester INT NOT NULL CHECK (semester IN (1, 2, 3)),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_year_semester (year, semester),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. ADMINISTRATORS (School executives/principals)
-- ==========================================
CREATE TABLE administrators (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(20) NOT NULL COMMENT 'คำนำหน้า เช่น นาย, นาง, นางสาว',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) COMMENT 'ตำแหน่ง เช่น ผู้อำนวยการ, รองผู้อำนวยการ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. TIMETABLE SETTINGS (Period configuration)
-- ==========================================
CREATE TABLE timetable_settings (
    id VARCHAR(36) PRIMARY KEY,
    period_number INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    label VARCHAR(100) COMMENT 'ชื่อคาบ เช่น คาบที่ 1, พักเที่ยง',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_period (period_number),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. SUBJECTS
-- ==========================================
CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE COMMENT 'รหัสวิชา',
    name VARCHAR(200) NOT NULL COMMENT 'ชื่อวิชา',
    periods_per_week INT DEFAULT 1 COMMENT 'จำนวนคาบต่อสัปดาห์',
    type ENUM('พื้นฐาน', 'เพิ่มเติม', 'กิจกรรม') DEFAULT 'พื้นฐาน',
    classroom VARCHAR(50) COMMENT 'ห้องเรียน/ชั้นเรียน เช่น ม.1/1, ม.2/3',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_classroom (classroom),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 6. TEACHERS
-- ==========================================
CREATE TABLE teachers (
    id VARCHAR(36) PRIMARY KEY,
    prefix VARCHAR(20) NOT NULL COMMENT 'คำนำหน้า เช่น นาย, นาง, นางสาว',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) COMMENT 'กลุ่มสาระ เช่น ภาษาไทย, คณิตศาสตร์',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_name (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 7. TEACHER ASSIGNMENTS (Which teacher teaches which subject in which class)
-- ==========================================
CREATE TABLE teacher_assignments (
    id VARCHAR(36) PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    classroom VARCHAR(50) NOT NULL COMMENT 'ห้องเรียนที่รับผิดชอบ',
    academic_year_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    INDEX idx_teacher (teacher_id),
    INDEX idx_subject (subject_id),
    INDEX idx_classroom (classroom),
    INDEX idx_year (academic_year_id),
    UNIQUE KEY unique_assignment (teacher_id, subject_id, classroom, academic_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 8. TIMETABLE (Main timetable data)
-- ==========================================
CREATE TABLE timetable (
    id VARCHAR(36) PRIMARY KEY,
    day ENUM('จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์') NOT NULL,
    period INT NOT NULL,
    subject_id VARCHAR(36),
    teacher_id VARCHAR(36),
    classroom VARCHAR(50) NOT NULL,
    academic_year_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    INDEX idx_day_period (day, period),
    INDEX idx_classroom (classroom),
    INDEX idx_year (academic_year_id),
    INDEX idx_subject (subject_id),
    INDEX idx_teacher (teacher_id),
    UNIQUE KEY unique_slot (day, period, classroom, academic_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 9. ACTIVITY LOG (Audit trail)
-- ==========================================
CREATE TABLE activity_log (
    id VARCHAR(36) PRIMARY KEY,
    action VARCHAR(100) NOT NULL COMMENT 'ประเภทการกระทำ',
    user VARCHAR(100) NOT NULL COMMENT 'ผู้ใช้ที่ทำรายการ',
    detail TEXT COMMENT 'รายละเอียด',
    ip_address VARCHAR(45) COMMENT 'IP Address',
    device VARCHAR(200) COMMENT 'อุปกรณ์/เบราว์เซอร์',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_user (user),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 10. ERROR LOG
-- ==========================================
CREATE TABLE error_log (
    id VARCHAR(36) PRIMARY KEY,
    function_name VARCHAR(100) NOT NULL COMMENT 'ฟังก์ชันที่เกิดข้อผิดพลาด',
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_function (function_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- DEFAULT DATA INSERTION
-- ==========================================

-- Default school info
INSERT INTO school_info (`key`, `value`) VALUES
('schoolName', 'โรงเรียนตัวอย่าง'),
('affiliation', 'สำนักงานเขตพื้นที่การศึกษา'),
('logoURL', ''),
('address', ''),
('phone', ''),
('email', '');

-- Default academic year (current year)
INSERT INTO academic_years (id, year, semester, start_date, end_date, is_active) VALUES
(UUID(), YEAR(CURDATE()), 1, CONCAT(YEAR(CURDATE()), '-05-01'), CONCAT(YEAR(CURDATE()), '-09-30'), TRUE),
(UUID(), YEAR(CURDATE()), 2, CONCAT(YEAR(CURDATE()), '-10-01'), CONCAT(YEAR(CURDATE())+1, '-02-28'), FALSE);

-- Default timetable periods (8 periods)
INSERT INTO timetable_settings (id, period_number, start_time, end_time, is_active, label) VALUES
(UUID(), 1, '08:30:00', '09:20:00', TRUE, 'คาบที่ 1'),
(UUID(), 2, '09:20:00', '10:10:00', TRUE, 'คาบที่ 2'),
(UUID(), 3, '10:10:00', '11:00:00', TRUE, 'คาบที่ 3'),
(UUID(), 4, '11:00:00', '11:50:00', TRUE, 'คาบที่ 4'),
(UUID(), 5, '12:50:00', '13:40:00', TRUE, 'คาบที่ 5 (บ่าย)'),
(UUID(), 6, '13:40:00', '14:30:00', TRUE, 'คาบที่ 6'),
(UUID(), 7, '14:30:00', '15:20:00', TRUE, 'คาบที่ 7'),
(UUID(), 8, '15:20:00', '16:10:00', TRUE, 'คาบที่ 8');

-- ==========================================
-- STORED PROCEDURES (Optional helpers)
-- ==========================================

DELIMITER //

-- Procedure to get timetable with details
CREATE PROCEDURE GetTimetableWithDetails(
    IN p_academic_year_id VARCHAR(36),
    IN p_classroom VARCHAR(50)
)
BEGIN
    SELECT 
        t.id,
        t.day,
        t.period,
        t.classroom,
        s.code AS subject_code,
        s.name AS subject_name,
        s.type AS subject_type,
        CONCAT(te.prefix, te.first_name, ' ', te.last_name) AS teacher_name,
        te.department,
        ts.start_time,
        ts.end_time,
        ts.label AS period_label
    FROM timetable t
    LEFT JOIN subjects s ON t.subject_id = s.id
    LEFT JOIN teachers te ON t.teacher_id = te.id
    LEFT JOIN timetable_settings ts ON t.period = ts.period_number
    WHERE t.academic_year_id = p_academic_year_id
    AND t.classroom = p_classroom
    ORDER BY FIELD(t.day, 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'),
    t.period;
END //

-- Procedure to get teacher workload
CREATE PROCEDURE GetTeacherWorkload(
    IN p_academic_year_id VARCHAR(36),
    IN p_teacher_id VARCHAR(36)
)
BEGIN
    SELECT 
        t.day,
        COUNT(*) AS period_count,
        GROUP_CONCAT(DISTINCT t.classroom ORDER BY t.classroom) AS classrooms
    FROM timetable t
    WHERE t.academic_year_id = p_academic_year_id
    AND t.teacher_id = p_teacher_id
    GROUP BY t.day
    ORDER BY FIELD(t.day, 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์');
END //

-- Procedure to check teacher conflict
CREATE PROCEDURE CheckTeacherConflict(
    IN p_day VARCHAR(20),
    IN p_period INT,
    IN p_teacher_id VARCHAR(36),
    IN p_academic_year_id VARCHAR(36),
    IN p_exclude_id VARCHAR(36)
)
BEGIN
    SELECT 
        t.id,
        t.classroom,
        s.name AS subject_name
    FROM timetable t
    LEFT JOIN subjects s ON t.subject_id = s.id
    WHERE t.day = p_day
    AND t.period = p_period
    AND t.teacher_id = p_teacher_id
    AND t.academic_year_id = p_academic_year_id
    AND (p_exclude_id IS NULL OR t.id != p_exclude_id);
END //

DELIMITER ;

-- ==========================================
-- VIEWS
-- ==========================================

-- View: Complete timetable overview
CREATE VIEW vw_timetable_overview AS
SELECT 
    t.id,
    ay.year,
    ay.semester,
    t.day,
    t.period,
    ts.start_time,
    ts.end_time,
    ts.label AS period_label,
    t.classroom,
    s.code AS subject_code,
    s.name AS subject_name,
    s.type AS subject_type,
    CONCAT(te.prefix, te.first_name, ' ', te.last_name) AS teacher_name,
    te.department
FROM timetable t
JOIN academic_years ay ON t.academic_year_id = ay.id
LEFT JOIN subjects s ON t.subject_id = s.id
LEFT JOIN teachers te ON t.teacher_id = te.id
LEFT JOIN timetable_settings ts ON t.period = ts.period_number
WHERE ts.is_active = TRUE OR ts.is_active IS NULL;

-- View: Teacher assignment summary
CREATE VIEW vw_teacher_assignments_summary AS
SELECT 
    ta.id,
    CONCAT(te.prefix, te.first_name, ' ', te.last_name) AS teacher_name,
    te.department,
    s.code AS subject_code,
    s.name AS subject_name,
    s.classroom AS subject_classroom,
    ta.classroom AS assigned_classroom,
    ay.year,
    ay.semester,
    COUNT(tt.id) AS actual_periods_assigned
FROM teacher_assignments ta
JOIN teachers te ON ta.teacher_id = te.id
JOIN subjects s ON ta.subject_id = s.id
JOIN academic_years ay ON ta.academic_year_id = ay.id
LEFT JOIN timetable tt ON ta.teacher_id = tt.teacher_id 
    AND ta.academic_year_id = tt.academic_year_id
    AND ta.classroom = tt.classroom
GROUP BY ta.id, te.prefix, te.first_name, te.last_name, te.department,
    s.code, s.name, s.classroom, ta.classroom, ay.year, ay.semester;
