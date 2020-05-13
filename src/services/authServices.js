import crypto from 'crypto'
import { User } from '../config/models'

export const shouldSignIn = async (req, res, next) => {
  try {
    if (!req.body.email)
      return res.status(401).json({ code: 147, error: 'Email cannot be empty' })

    if (!req.body.password)
      return res.status(401).json({ code: 103, error: 'Password cannot be empty' })

    let user = await User.findOne({ email: req.body.email })

    if (!user) return res.status(401).json({ code: 143, error: 'Wrong email' })

    if (!user.comparePassword(req.body.password))
      return res.status(401).json({ code: 144, error: 'Wrong password' })

    user.token = crypto.createHash('sha256').update(crypto.randomBytes(48).toString('hex')).digest('hex')
    await user.save()

    req.user = user
    req.session.token = user.token
    return next()

  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}

export const requireAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ token: req.session.token })

    if (!user)
      if (req.url.includes('/dashboard'))
        return res.redirect('/dashboard/login.html')
      else
        return res.status(401).end()

    req.user = user

    return next()

  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
