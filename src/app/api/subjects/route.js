import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/subjects
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const classroom = searchParams.get('classroom')
    
    let sql = 'SELECT * FROM subjects'
    const params = []
    
    if (classroom) {
      sql += ' WHERE classroom = ?'
      params.push(classroom)
    }
    
    sql += ' ORDER BY code ASC'
    
    const result = await query(sql, params)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/subjects
export async function POST(request) {
  try {
    const { code, name, periodsPerWeek, type, classroom } = await request.json()
    const id = crypto.randomUUID()
    
    await query(
      'INSERT INTO subjects (id, code, name, periods_per_week, type, classroom) VALUES (?, ?, ?, ?, ?, ?)',
      [id, code ?? null, name ?? null, periodsPerWeek ?? 1, type ?? 'พื้นฐาน', classroom ?? null]
    )
    
    return NextResponse.json({ success: true, id, message: 'เพิ่มรายวิชาเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/subjects
export async function PUT(request) {
  try {
    const { id, code, name, periodsPerWeek, type, classroom } = await request.json()
    
    await query(
      'UPDATE subjects SET code = ?, name = ?, periods_per_week = ?, type = ?, classroom = ? WHERE id = ?',
      [code ?? null, name ?? null, periodsPerWeek ?? 1, type ?? 'พื้นฐาน', classroom ?? null, id]
    )
    
    return NextResponse.json({ success: true, message: 'แก้ไขรายวิชาเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/subjects
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await query('DELETE FROM subjects WHERE id = ?', [id])
    
    return NextResponse.json({ success: true, message: 'ลบรายวิชาเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
