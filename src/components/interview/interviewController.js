import { Interview, Candidate } from '../../config/models'

export async function create(req, res) {

  req.body.recruiter = req.user._id

  let interview = await Interview.create(req.body)
  interview = await Interview.findOne({ _id: interview._id }).populate('candidate recruiter qcm')

  return res.json({ interview })
}

export async function getAll(req, res) {
  const interviews = await Interview.find().populate('candidate recruiter qcm')
  return res.json({ interviews })
}

export async function update(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ code: 117, error: 'interview ID cannot be empty' })

    const interview = await Interview.update({ _id: req.params.id }, { $set: req.body })

    return res.json(interview)

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}

export async function remove(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ code: 117, error: 'interview ID cannot be empty' })

    await Interview.remove({ _id: req.params.id })

    return res.json({ success: true })

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}

export async function start(req, res) {
  try {
    if (!req.body.cin)
      return res.status(400).json({ error: 'CIN cannot be empty' })

    const candidate = await Candidate.findOne({ cin: req.body.cin })

    if (!candidate)
      return res.status(400).json({ error: 'Not programed interview' })

    let interview = await Interview.findOne({ candidate: candidate._id }).populate({ path: 'qcm', populate: { path: 'questions' } }).select('title questions')

    if (!interview)
      return res.status(400).json({ error: 'Not programed interview' })

    // for (let question of interview.questions) {

    // }

    return res.json({ id: interview._id, qcm: interview.qcm })

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}

export async function postResult(req, res) {
  try {

    if (!req.body.cin)
      return res.status(400).json({ code: 117, error: 'interview ID cannot be empty' })

    const candidate = await Candidate.findOne({ cin: req.body.cin })

    if (!candidate)
      return res.status(400).json({ error: 'Not programed interview' })

    let interview = await Interview.findOne({ candidate: candidate._id })

    let result = {
      totalPoints: 0,
      questions: []
    }

    for (let questionResult of req.body.qcmResult) {

      let question = { time: questionResult.time, points: 0 }

      let neutral = 0
      let happy = 0
      let sad = 0
      let angry = 0
      let fearful = 0
      let disgusted = 0
      let surprised = 0

      let totalExpressions = 0

      for (let expressionResult of req.body.expressionResult) {
        if (expressionResult.time > question.time)
          break;

        switch (expressionResult.expression) {
          case 'neutral':
            neutral++
            break;
          case 'happy':
            happy++
            break;
          case 'sad':
            sad++
            break;
          case 'angry':
            angry++
            break;
          case 'fearful':
            fearful++
            break;
          case 'disgusted':
            disgusted++
            break;
          case 'surprised':
            surprised++
            break;

          default:
            break;
        }

        totalExpressions++
      }

      neutral *= (100 / totalExpressions)
      happy *= (100 / totalExpressions)
      sad *= (100 / totalExpressions)
      angry *= (100 / totalExpressions)
      fearful *= (100 / totalExpressions)
      disgusted *= (100 / totalExpressions)
      surprised *= (100 / totalExpressions)

      question.expressions = [
        {
          name: 'neutral',
          percentage: neutral
        },
        {
          name: 'happy',
          percentage: happy
        },
        {
          name: 'sad',
          percentage: sad
        },
        {
          name: 'angry',
          percentage: angry
        },
        {
          name: 'fearful',
          percentage: fearful
        },
        {
          name: 'disgusted',
          percentage: disgusted
        },
        {
          name: 'surprised',
          percentage: surprised
        }
      ]

      console.log(question)

      result.questions.push(question)
    }

    interview.result = result
    interview.status = 'Passed'

    interview.save()

    return res.json(result)

  } catch (error) {

    console.log(error)
    return res.status(500).end()
  }
}