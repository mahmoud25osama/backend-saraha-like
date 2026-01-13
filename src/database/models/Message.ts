import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
    recipient: mongoose.Types.ObjectId
    content: string
    isRead: boolean
    isFavorite: boolean
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
}

const messageSchema = new Schema<IMessage>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        content: {
            type: String,
            required: [true, 'Message content is required'],
            trim: true,
            minlength: 1,
            maxlength: 1000,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

// Index for efficient querying
messageSchema.index({ recipient: 1, createdAt: -1 })
messageSchema.index({ recipient: 1, isDeleted: 1 })

export default mongoose.model<IMessage>('Message', messageSchema)
