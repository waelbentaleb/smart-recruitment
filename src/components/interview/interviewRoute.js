import { requireAuth } from '../../services/authServices'
import { getAll, create, update, remove, start, postResult } from './interviewController'

export default function (router) {
  router.get('/interviews', getAll)
  router.post('/interview', requireAuth, create)
  router.put('/interview/:id', update)
  router.delete('/interview/:id', remove)

  router.post('/interview/start', start)
  router.post('/interview/result', postResult)
}
