import { Question } from '../../config/models'

export async function create(req, res) {
  const question = await Question.create(req.body)
  return res.json({ question })
}

export async function getAll(req, res) {
  const questions = await Question.find()
  return res.json({ questions })
}

export async function update(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ code: 117, error: 'question ID cannot be empty' })

    const question = await Question.update({ _id: req.params.id }, { $set: req.body })

    return res.json(question)

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}

export async function remove(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ code: 117, error: 'question ID cannot be empty' })

    await Question.remove({ _id: req.params.id })

    return res.json({ success: true })

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}