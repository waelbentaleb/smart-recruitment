import { requireAuth } from '../../services/authServices'
import { login } from './staticController'

export default function (router) {
  router.get('/dashboard/login.html', login)
  router.get('/dashboard/', requireAuth)
}
