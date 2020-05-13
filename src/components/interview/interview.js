import mongoose, { Schema } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const interviewSchema = new Schema(
  {
    qcm: { type: mongoose.Schema.Types.ObjectId, ref: 'qcm' },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'candidate' },
    status: { type: String, default: 'pending' }, // passed
    date: { type: Date, },
    result: {
      totalPoints: { type: Number },
      questions: [{
        expressions: [{
          name: { type: String },
          percentage: { type: Number },
        }],
        points: { type: Number },
        time: { type: Number }
      }]
    }
  },
  {
    timestamps: true
  }
)

interviewSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true, deletedBy: true })
export default mongoose.model('interview', interviewSchema)


var x = {
  "questions": [
    {
      "expressions": [{
        "name": "neutral",
        "percentage": 8
      },
      {
        "name": "happy",
        "percentage": 35
      },
      {
        "name": "sad",
        "percentage": 15
      },
      {
        "name": "angry",
        "percentage": 5
      },
      {
        "name": "fearful",
        "percentage": 10
      },
      {
        "name": "disgusted",
        "percentage": 17
      },
      {
        "name": "surprised",
        "percentage": 10
      }]
    },
    {
      "expressions": [{
        "name": "neutral",
        "percentage": 8
      },
      {
        "name": "happy",
        "percentage": 35
      },
      {
        "name": "sad",
        "percentage": 15
      },
      {
        "name": "angry",
        "percentage": 5
      },
      {
        "name": "fearful",
        "percentage": 10
      },
      {
        "name": "disgusted",
        "percentage": 17
      },
      {
        "name": "surprised",
        "percentage": 10
      }]
    },
    {
      "expressions": [{
        "name": "neutral",
        "percentage": 8
      },
      {
        "name": "happy",
        "percentage": 35
      },
      {
        "name": "sad",
        "percentage": 15
      },
      {
        "name": "angry",
        "percentage": 5
      },
      {
        "name": "fearful",
        "percentage": 10
      },
      {
        "name": "disgusted",
        "percentage": 17
      },
      {
        "name": "surprised",
        "percentage": 10
      }]
    }
  ]

}