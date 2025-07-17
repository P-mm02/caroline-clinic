import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/cookies'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  setAuthCookie(response, '', null, 0) // Remove cookies
  return response
}
