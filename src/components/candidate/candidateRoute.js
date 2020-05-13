import { requireAuth } from '../../services/authServices'
import { getAll, create, update, remove } from './candidateController'

export default function (router) {
  router.get('/candidates', getAll)
  router.post('/candidate', requireAuth, create)
  router.put('/candidate/:id', requireAuth, update)
  router.delete('/candidate/:id', requireAuth, remove)
}
