import express from 'express'
const router = express.Router()

import staticRoute from '../components/static/staticRoute'
import userRoute from '../components/user/userRoute'
import candidateRoute from '../components/candidate/candidateRoute'
import uploadRoute from '../components/upload/uploadRoute'
import questionRoute from '../components/question/questionRoute'
import qcmRoute from '../components/qcm/qcmRoute'
import interviewRoute from '../components/interview/interviewRoute'

staticRoute(router)
userRoute(router)
candidateRoute(router)
uploadRoute(router)
questionRoute(router)
qcmRoute(router)
interviewRoute(router)

export default router
