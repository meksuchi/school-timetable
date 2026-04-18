import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/school-info
export async function GET() {
  try {
    const result = await query('SELECT `key`, `value` FROM school_info')
    const info = {}
    result.forEach(row => {
      info[row.key] = row.value
    })
    return NextResponse.json(info)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/school-info
export async function PUT(request) {
  try {
    const data = await request.json()
    
    for (const [key, value] of Object.entries(data)) {
      const safeValue = value ?? null
      await query(
        'INSERT INTO school_info (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        [key, safeValue, safeValue]
      )
    }
    
    return NextResponse.json({ success: true, message: 'บันทึกข้อมูลเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
