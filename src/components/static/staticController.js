import { User } from '../../config/models'
import path from 'path'

export async function login(req, res, next) {
  try {
    const user = await User.findOne({ token: req.session.token})
    
    if (user)
      return res.redirect('/dashboard/')
    else
      return res.sendFile(path.join(__dirname + '/../../../public/dashboard/login.html'));

  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }

}
