import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/academic-years
export async function GET() {
  try {
    const result = await query('SELECT * FROM academic_years ORDER BY year DESC, semester ASC')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/academic-years
export async function POST(request) {
  try {
    const { year, semester, startDate, endDate, isActive } = await request.json()
    const id = crypto.randomUUID()
    
    // If setting this year as active, deactivate others
    if (isActive) {
      await query('UPDATE academic_years SET is_active = FALSE')
    }
    
    await query(
      'INSERT INTO academic_years (id, year, semester, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [id, year ?? null, semester ?? 1, startDate ?? null, endDate ?? null, isActive ?? false]
    )
    
    return NextResponse.json({ success: true, id, message: 'เพิ่มปีการศึกษาเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/academic-years
export async function PUT(request) {
  try {
    const { id, year, semester, startDate, endDate, isActive } = await request.json()
    
    // If setting this year as active, deactivate others
    if (isActive) {
      await query('UPDATE academic_years SET is_active = FALSE')
    }
    
    await query(
      'UPDATE academic_years SET year = ?, semester = ?, start_date = ?, end_date = ?, is_active = ? WHERE id = ?',
      [year ?? null, semester ?? 1, startDate ?? null, endDate ?? null, isActive ?? false, id]
    )
    
    return NextResponse.json({ success: true, message: 'แก้ไขปีการศึกษาเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/academic-years
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await query('DELETE FROM academic_years WHERE id = ?', [id])
    
    return NextResponse.json({ success: true, message: 'ลบปีการศึกษาเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
