import mongoose, { Schema } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const candidateSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true },
    position: { type: String },
    phone: { type: String },
    cin: { type: String },
    cv: { type: String },
    status: { type: String, default: 'Pending' },  // accepted, refused
    recruiter : { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
  },
  {
    timestamps: true
  }
)

candidateSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true, deletedBy: true })
export default mongoose.model('candidate', candidateSchema)
