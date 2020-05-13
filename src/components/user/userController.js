
export function signIn(req, res) {
  let user = req.user
  delete user.password
  return res.json({ user: user })
}

export async function signOut(req, res) {
  try {
    delete req.user.token
    delete req.session.token
    await req.user.save()

    return res.status(204).end()

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}

export async function current(req, res) {
  try {
    
    return res.json({username : req.user.name})

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}

export async function update(req, res) {
	const oldPwd = req.body.currentPassword;
	const newPassword = req.body.newPassword

	try {
		if (newPassword.lenght < 8)
			return res.status(400).json({ error: 'New password must be longer than 8 characters !' })

		if (!req.user.comparePassword(oldPwd))
			return res.status(400).json({ error: 'Wrong old password !' })

		req.user.password = newPassword
		await req.user.save()
		return res.status(204).end()

	} catch (error) {

		console.log(error)
		return res.status(500).end()
	}
}