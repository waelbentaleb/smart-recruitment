import { requireAuth } from '../../services/authServices'
import { getAll, create, update, remove } from './questionController'

export default function (router) {
  router.get('/questions', requireAuth, getAll)
  router.post('/question', requireAuth, create)
  router.put('/question/:id', requireAuth, update)
  router.delete('/question/:id', requireAuth, remove)
}
