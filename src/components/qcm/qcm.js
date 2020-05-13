import mongoose, { Schema } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const qcmSchema = new Schema(
  {
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question' }],
    title: { type: String}
  },
  {
    timestamps: true
  }
)

qcmSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true, deletedBy: true })
export default mongoose.model('qcm', qcmSchema)
