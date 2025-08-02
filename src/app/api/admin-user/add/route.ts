import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectToDB()

    // Use formData for multipart/form-data requests
    const formData = await req.formData()
    const username = String(formData.get('username') || '')
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const role = String(formData.get('role') || 'viewer')
    const active = String(formData.get('active') ?? 'true') === 'true'
    const avatar = formData.get('avatar') as File | null

    // Debug: log all form fields
    console.log('DEBUG:', { username, email, password, role, active, avatar })

    // Basic validation
    if (!username.trim() || username.length < 3) {
      console.log('DEBUG: username validation failed')
      return NextResponse.json(
        { error: 'Username is required (min 3 chars)' },
        { status: 400 }
      )
    }
    if (!password.trim() || password.length < 0) {
      console.log('DEBUG: password validation failed')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check for duplicate username or email
    const exists = await AdminUser.findOne({
      $or: [{ username }, { email }],
    })
    if (exists) {
      console.log('DEBUG: duplicate username/email')
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Handle avatar upload here (not implemented in this example)
    let avatarUrl = ''
    // if (avatar) {
    //   avatarUrl = await uploadToCloudinaryOrYourStorage(avatar)
    // }

    // Create the user
    const newUser = await AdminUser.create({
      username,
      email,
      password: hashedPassword,
      role,
      active,
      avatarUrl,
    })

    console.log('DEBUG: user created successfully', newUser)

    return NextResponse.json(
      { message: 'Admin user created', user: newUser },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('❌ Error creating admin user:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
