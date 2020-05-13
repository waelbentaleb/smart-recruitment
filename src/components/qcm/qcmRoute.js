import { requireAuth } from '../../services/authServices'
import { getAll, create, update, remove } from './qcmController'

export default function (router) {
  router.get('/qcms', requireAuth, getAll)
  router.post('/qcm', requireAuth, create)
  router.put('/qcm/:id', requireAuth, update)
  router.delete('/qcm/:id', requireAuth, remove)
}
