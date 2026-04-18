# 🏫 School Timetable Management System

ระบบจัดตารางเรียนออนไลน์ พัฒนาด้วย Next.js + MySQL

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create MySQL database
mysql -u root -p < database/school_timetable_schema.sql
```

### 3. Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your database credentials
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000/timetable](http://localhost:3000/timetable)

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   └── timetable/        # Main UI Page
│   └── lib/
│       └── db.js             # Database connection
├── database/
│   └── school_timetable_schema.sql
└── package.json
```

## 🗄️ Database Tables

- school_info
- academic_years
- administrators
- timetable_settings
- subjects
- teachers
- teacher_assignments
- timetable
- activity_log
- error_log

## 📝 Features

- ✅ Dashboard with statistics
- ✅ School information management
- ✅ Academic year management
- ✅ Administrator management
- ✅ Timetable period settings
- ✅ Subject management
- ✅ Teacher management
- ✅ Teacher assignments
- ✅ Timetable builder (drag & drop)
- ✅ Timetable view/print
- ✅ Activity logging
- ✅ Dark/Light mode
- ✅ Responsive design

## 🎨 UI Design

Glassmorphism design pattern inspired by the expenses system.

## 📄 License

MIT
