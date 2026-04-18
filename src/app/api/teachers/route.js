import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/teachers
export async function GET() {
  try {
    const result = await query('SELECT * FROM teachers ORDER BY department, last_name, first_name')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/teachers
export async function POST(request) {
  try {
    const { prefix, firstName, lastName, department } = await request.json()
    const id = crypto.randomUUID()
    
    await query(
      'INSERT INTO teachers (id, prefix, first_name, last_name, department) VALUES (?, ?, ?, ?, ?)',
      [id, prefix, firstName, lastName, department]
    )
    
    return NextResponse.json({ success: true, id, message: 'เพิ่มครูผู้สอนเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/teachers
export async function PUT(request) {
  try {
    const { id, prefix, firstName, lastName, department } = await request.json()
    
    await query(
      'UPDATE teachers SET prefix = ?, first_name = ?, last_name = ?, department = ? WHERE id = ?',
      [prefix, firstName, lastName, department, id]
    )
    
    return NextResponse.json({ success: true, message: 'แก้ไขข้อมูลครูเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/teachers
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await query('DELETE FROM teachers WHERE id = ?', [id])
    
    return NextResponse.json({ success: true, message: 'ลบข้อมูลครูเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
