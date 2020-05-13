import { QCM } from '../../config/models'

export async function create(req, res) {
  const qcm = await QCM.create(req.body)
  return res.json({ qcm })
}

export async function getAll(req, res) {
  const qcms = await QCM.find().populate('questions')
  return res.json({ qcms })
}

export async function update(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ code: 117, error: 'qcm ID cannot be empty' })

    const qcm = await QCM.update({ _id: req.params.id }, { $set: req.body })

    return res.json(qcm)

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}

export async function remove(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ code: 117, error: 'qcm ID cannot be empty' })

    await QCM.remove({ _id: req.params.id })

    return res.json({ success: true })

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}