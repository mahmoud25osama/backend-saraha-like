import { connect } from 'mongoose'

export const dbConn = () => {
    connect(process.env.MONGODB_URI || '')
        .then(() => {
            console.log(`MongoDB Connected Successfully.`)
        })
        .catch((error) => {
            console.error('Error connecting to MongooseDB:', error)
        })
}
