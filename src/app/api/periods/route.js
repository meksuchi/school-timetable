import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/periods
export async function GET() {
  try {
    const result = await query('SELECT * FROM timetable_settings ORDER BY period_number')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/periods (Bulk save)
export async function POST(request) {
  try {
    const { periods } = await request.json()
    
    // Clear existing
    await query('DELETE FROM timetable_settings')
    
    // Insert new periods
    for (const p of periods || []) {
      const id = crypto.randomUUID()
      await query(
        'INSERT INTO timetable_settings (id, period_number, start_time, end_time, is_active, label) VALUES (?, ?, ?, ?, ?, ?)',
        [id, p?.periodNumber ?? null, p?.startTime ?? null, p?.endTime ?? null, p?.isActive ?? true, p?.label ?? null]
      )
    }
    
    return NextResponse.json({ success: true, message: 'บันทึกการตั้งค่าคาบเรียนเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
