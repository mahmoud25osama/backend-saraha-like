import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local / Vercel'
    )
}

async function dbConn() {
    const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        minPoolSize: 2,
    }

    let conn = mongoose
        .connect(MONGODB_URI!, opts)
        .then((mongoose) => {
            console.log('🔥 New MongoDB connection established')
            return mongoose
        })
        .catch((err) => {
            console.error('❌ MongoDB connection error:', err)
            throw err
        })

    return conn
}

export { dbConn }
