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
      [id, year, semester, startDate, endDate, isActive]
    )
    
    return NextResponse.json({ success: true, id, message: 'เพิ่มปีการศึกษาเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
