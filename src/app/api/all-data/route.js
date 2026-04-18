import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/all-data (for dashboard/reports)
export async function GET() {
  try {
    const [
      subjects,
      teachers,
      assignments,
      timetable,
      academicYears,
      settings,
      schoolInfoRows,
      admins,
      activityLog
    ] = await Promise.all([
      query('SELECT * FROM subjects ORDER BY code ASC'),
      query('SELECT * FROM teachers ORDER BY department, last_name, first_name'),
      query(`
        SELECT ta.*, 
               te.prefix as teacher_prefix, te.first_name as teacher_first_name, te.last_name as teacher_last_name,
               s.code as subject_code, s.name as subject_name, s.classroom as subject_classroom
        FROM teacher_assignments ta
        LEFT JOIN teachers te ON ta.teacher_id = te.id
        LEFT JOIN subjects s ON ta.subject_id = s.id
        ORDER BY ta.classroom, s.code
      `),
      query(`
        SELECT t.*, s.code as subject_code, s.name as subject_name, s.type as subject_type,
               te.prefix as teacher_prefix, te.first_name as teacher_first_name, te.last_name as teacher_last_name
        FROM timetable t
        LEFT JOIN subjects s ON t.subject_id = s.id
        LEFT JOIN teachers te ON t.teacher_id = te.id
        ORDER BY FIELD(t.day, 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'), t.period
      `),
      query('SELECT * FROM academic_years ORDER BY year DESC, semester ASC'),
      query('SELECT * FROM timetable_settings ORDER BY period_number'),
      query('SELECT `key`, `value` FROM school_info'),
      query('SELECT * FROM administrators ORDER BY position, last_name'),
      query('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 50')
    ])

    // Convert school_info rows to object
    const schoolInfo = {}
    schoolInfoRows.forEach(row => {
      schoolInfo[row.key] = row.value
    })

    return NextResponse.json({
      subjects,
      teachers,
      assignments,
      timetable,
      academicYears,
      settings,
      schoolInfo,
      admins,
      activityLog
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
