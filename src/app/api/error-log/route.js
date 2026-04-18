import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/error-log
export async function GET() {
  try {
    const result = await query('SELECT * FROM error_log ORDER BY timestamp DESC LIMIT 100')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/error-log
export async function POST(request) {
  try {
    const { functionName, errorMessage, stackTrace } = await request.json()
    const id = crypto.randomUUID()
    
    await query(
      'INSERT INTO error_log (id, function_name, error_message, stack_trace) VALUES (?, ?, ?, ?)',
      [id, functionName, errorMessage, stackTrace]
    )
    
    return NextResponse.json({ success: true, id, message: 'บันทึกข้อผิดพลาดเรียบร้อย' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
