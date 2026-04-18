import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/activity-log
export async function GET() {
  try {
    const result = await query('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 100')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/activity-log
export async function POST(request) {
  try {
    const { action, user, detail, ipAddress, device } = await request.json()
    const id = crypto.randomUUID()
    
    await query(
      'INSERT INTO activity_log (id, action, user, detail, ip_address, device) VALUES (?, ?, ?, ?, ?, ?)',
      [id, action, user, detail, ipAddress, device]
    )
    
    return NextResponse.json({ success: true, id })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
