import mongoose from 'mongoose'

let isConnected = false

export const dbConn = async () => {
    if (isConnected) return

    await mongoose.connect(process.env.MONGODB_URI || '', {
        dbName: 'saraha-like',
    })

    isConnected = true
    console.log('MongoDB Connected Successfully.')
}
