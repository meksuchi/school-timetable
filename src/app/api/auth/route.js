import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// POST /api/auth/login
export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // Simple auth check - can be replaced with proper auth later
    if (username === 'admin' && password === 'admin123') {
      // Log activity
      const id = crypto.randomUUID()
      await query(
        'INSERT INTO activity_log (id, action, user, detail, ip_address, device) VALUES (?, ?, ?, ?, ?, ?)',
        [id, 'LOGIN', username, 'Admin logged in', 'N/A', 'Browser']
      )

      return NextResponse.json({
        success: true,
        user: { username: 'admin', role: 'admin', name: 'ผู้ดูแลระบบ' }
      })
    }

    return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
