import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'

export async function GET() {
  try {
    await connectToDB()
    // Example: Return a simple JSON message to test the connection
    return NextResponse.json({ message: 'MongoDB connection successful! 🎉' })
  } catch (error) {
    return NextResponse.json(
      { error: 'MongoDB connection failed.' },
      { status: 500 }
    )
  }
}
