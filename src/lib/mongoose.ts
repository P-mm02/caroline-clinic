import mongoose, { Mongoose } from 'mongoose'

interface MongooseGlobal {
  mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

// Extend globalThis safely
const globalWithMongoose = globalThis as typeof globalThis & MongooseGlobal

const cached = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
}

globalWithMongoose.mongoose = cached

export async function connectToDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'CarolineClinic',
      bufferCommands: false,
      maxPoolSize: 10,
    })
    console.log('successfully connect DB')
  }
  
  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    console.error('❌ Mongoose connection error:', error)
    throw error
  }
}
