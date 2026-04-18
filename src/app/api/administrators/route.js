import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/administrators
export async function GET() {
  try {
    const result = await query('SELECT * FROM administrators ORDER BY position, last_name')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/administrators
export async function POST(request) {
  try {
    const { title, firstName, lastName, position } = await request.json()
    const id = crypto.randomUUID()
    
    await query(
      'INSERT INTO administrators (id, title, first_name, last_name, position) VALUES (?, ?, ?, ?, ?)',
      [id, title ?? null, firstName ?? null, lastName ?? null, position ?? null]
    )
    
    return NextResponse.json({ success: true, id, message: 'เพิ่มผู้บริหารเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/administrators
export async function PUT(request) {
  try {
    const { id, title, firstName, lastName, position } = await request.json()
    
    await query(
      'UPDATE administrators SET title = ?, first_name = ?, last_name = ?, position = ? WHERE id = ?',
      [title ?? null, firstName ?? null, lastName ?? null, position ?? null, id]
    )
    
    return NextResponse.json({ success: true, message: 'แก้ไขข้อมูลผู้บริหารเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/administrators
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await query('DELETE FROM administrators WHERE id = ?', [id])
    
    return NextResponse.json({ success: true, message: 'ลบผู้บริหารเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
