import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local / Vercel'
    )
}

let cached = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}

async function dbConn() {
    if (cached.conn) {
        console.log('👌 Using existing MongoDB connection')
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
            minPoolSize: 2,
        }

        cached.promise = mongoose
            .connect(MONGODB_URI!, opts)
            .then((mongoose) => {
                console.log('🔥 New MongoDB connection established')
                return mongoose
            })
            .catch((err) => {
                cached.promise = null
                throw err
            })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export { dbConn }
