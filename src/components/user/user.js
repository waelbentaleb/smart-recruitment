import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true },
    hashedPassword: { type: String, required: true },
    token: { type: String }
  },
  {
    timestamps: true
  }
)

userSchema.virtual('password')
  .set(function (password) {
    this.hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(13))
  })

userSchema.methods = {
  comparePassword(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.hashedPassword)
  }
}

userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true, deletedBy: true })

export default mongoose.model('user', userSchema)
