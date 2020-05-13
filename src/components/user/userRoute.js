import { requireAuth, shouldSignIn } from '../../services/authServices'
import { signIn, signOut, current, update } from './userController'

export default function (router) {
  router.post('/signIn', shouldSignIn, signIn)
  router.put('/signOut', requireAuth, signOut)

  router.get('/user/current', requireAuth, current)
  router.put('/user/changePassword', requireAuth, update)
}
