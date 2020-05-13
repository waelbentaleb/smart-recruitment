import mongoose, { Schema } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const questionSchema = new Schema(
  {
    text: { type: String },
    responses: [{
      text: { type: String },
      points: { type: Number }
    }]
  },
  {
    timestamps: true
  }
)
questionSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true, deletedBy: true })
export default mongoose.model('question', questionSchema)
