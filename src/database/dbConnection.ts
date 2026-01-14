import mongoose from 'mongoose'

let isConnected = false

export const dbConn = async () => {
    if (isConnected) return

    try {
        await mongoose.connect(process.env.MONGODB_URI || '', {
            dbName: 'saraha-like',
        })
        isConnected = true
        console.log('MongoDB Connected Successfully.')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw error
    }
}
