import { Candidate } from '../../config/models'

export async function create(req, res) {
  req.body.recruiter = req.user._id
  let candidate = await Candidate.create(req.body)
  candidate = await Candidate.findOne({ _id: candidate._id }).populate('recruiter')
  return res.json({ candidate })
}

export async function getAll(req, res) {
  const candidates = await Candidate.find().populate('recruiter')
  return res.json({ candidates })
}

export async function update(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ code: 117, error: 'Candidate ID cannot be empty' })

    const candidate = await Candidate.update({ _id: req.params.id }, { $set: req.body })

    return res.json(candidate)

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}

export async function remove(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ code: 117, error: 'Candidate ID cannot be empty' })

    await Candidate.remove({ _id: req.params.id })

    return res.json({ success: true })

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}