import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/timetable
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const academicYearId = searchParams.get('academicYearId')
    const classroom = searchParams.get('classroom')
    const teacherId = searchParams.get('teacherId')
    
    let sql = `
      SELECT t.*, s.code as subject_code, s.name as subject_name, s.type as subject_type,
             te.prefix as teacher_prefix, te.first_name as teacher_first_name, te.last_name as teacher_last_name
      FROM timetable t
      LEFT JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN teachers te ON t.teacher_id = te.id
      WHERE 1=1
    `
    const params = []
    
    if (academicYearId) {
      sql += ' AND t.academic_year_id = ?'
      params.push(academicYearId)
    }
    if (classroom) {
      sql += ' AND t.classroom = ?'
      params.push(classroom)
    }
    if (teacherId) {
      sql += ' AND t.teacher_id = ?'
      params.push(teacherId)
    }
    
    sql += ' ORDER BY FIELD(t.day, "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"), t.period'
    
    const result = await query(sql, params)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/timetable (Single entry)
export async function POST(request) {
  try {
    const { day, period, subjectId, teacherId, classroom, academicYearId } = await request.json()
    
    // Check if entry exists
    const existing = await query(
      'SELECT id, subject_id, teacher_id FROM timetable WHERE day = ? AND period = ? AND classroom = ? AND academic_year_id = ?',
      [day ?? null, period ?? null, classroom ?? null, academicYearId ?? null]
    )
    
    if (existing.length > 0) {
      // Check if data actually changed
      const currentSubjectId = existing[0].subject_id ?? null
      const currentTeacherId = existing[0].teacher_id ?? null
      const newSubjectId = subjectId ?? null
      const newTeacherId = teacherId ?? null
      
      if (currentSubjectId === newSubjectId && currentTeacherId === newTeacherId) {
        // No change detected
        return NextResponse.json({ success: true, changed: false, message: 'ข้อมูลไม่มีการเปลี่ยนแปลง' })
      }
      
      // Update existing
      await query(
        'UPDATE timetable SET subject_id = ?, teacher_id = ? WHERE id = ?',
        [subjectId ?? null, teacherId ?? null, existing[0].id]
      )
      return NextResponse.json({ success: true, changed: true, message: 'อัพเดตตารางเรียนเรียบร้อย' })
    } else {
      // Insert new
      const id = crypto.randomUUID()
      await query(
        'INSERT INTO timetable (id, day, period, subject_id, teacher_id, classroom, academic_year_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, day ?? null, period ?? null, subjectId ?? null, teacherId ?? null, classroom ?? null, academicYearId ?? null]
      )
      return NextResponse.json({ success: true, changed: true, id, message: 'บันทึกตารางเรียนเรียบร้อย' })
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/timetable (Bulk save - clear and reinsert)
export async function PUT(request) {
  try {
    const { entries, classroom, academicYearId } = await request.json()
    
    // Delete existing entries for this classroom/year
    await query(
      'DELETE FROM timetable WHERE classroom = ? AND academic_year_id = ?',
      [classroom ?? null, academicYearId ?? null]
    )
    
    // Insert new entries
    for (const entry of entries || []) {
      const id = crypto.randomUUID()
      await query(
        'INSERT INTO timetable (id, day, period, subject_id, teacher_id, classroom, academic_year_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, entry?.day ?? null, entry?.period ?? null, entry?.subjectId ?? null, entry?.teacherId ?? null, classroom ?? null, academicYearId ?? null]
      )
    }
    
    return NextResponse.json({ success: true, message: 'บันทึกตารางเรียนเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/timetable
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await query('DELETE FROM timetable WHERE id = ?', [id])
    
    return NextResponse.json({ success: true, message: 'ลบรายการตารางเรียนเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
