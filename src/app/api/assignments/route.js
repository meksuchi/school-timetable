import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/assignments
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const academicYearId = searchParams.get('academicYearId')
    const classroom = searchParams.get('classroom')
    
    let sql = `
      SELECT ta.*, 
             te.prefix as teacher_prefix, te.first_name as teacher_first_name, te.last_name as teacher_last_name,
             s.code as subject_code, s.name as subject_name, s.classroom as subject_classroom
      FROM teacher_assignments ta
      LEFT JOIN teachers te ON ta.teacher_id = te.id
      LEFT JOIN subjects s ON ta.subject_id = s.id
      WHERE 1=1
    `
    const params = []
    
    if (academicYearId) {
      sql += ' AND ta.academic_year_id = ?'
      params.push(academicYearId)
    }
    if (classroom) {
      sql += ' AND ta.classroom = ?'
      params.push(classroom)
    }
    
    sql += ' ORDER BY ta.classroom, s.code'
    
    const result = await query(sql, params)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/assignments
export async function POST(request) {
  try {
    const { teacherId, subjectId, classroom, academicYearId } = await request.json()
    const id = crypto.randomUUID()
    
    await query(
      'INSERT INTO teacher_assignments (id, teacher_id, subject_id, classroom, academic_year_id) VALUES (?, ?, ?, ?, ?)',
      [id, teacherId, subjectId, classroom, academicYearId]
    )
    
    return NextResponse.json({ success: true, id, message: 'จัดครูผู้สอนเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/assignments
export async function PUT(request) {
  try {
    const { id, teacherId, subjectId, classroom, academicYearId } = await request.json()
    
    await query(
      'UPDATE teacher_assignments SET teacher_id = ?, subject_id = ?, classroom = ?, academic_year_id = ? WHERE id = ?',
      [teacherId, subjectId, classroom, academicYearId, id]
    )
    
    return NextResponse.json({ success: true, message: 'แก้ไขการจัดครูผู้สอนเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/assignments
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await query('DELETE FROM teacher_assignments WHERE id = ?', [id])
    
    return NextResponse.json({ success: true, message: 'ลบการจัดครูผู้สอนเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
