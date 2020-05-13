import { requireAuth } from '../../services/authServices'
import upload from './uploadController'

export default function (router) {
  router.post('/upload', requireAuth, upload)
}
