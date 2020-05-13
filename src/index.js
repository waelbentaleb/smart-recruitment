import http from 'http'
import https from 'https'
import fs from 'fs'
import morgan from 'morgan'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import routes from './config/routes'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import { PORT, NODE_ENV, DB, SECRET } from './config/env'

const app = express()
const mongoStore = connectMongo(session)
const server = http.createServer(app)

// const server = https.createServer({
//   key: fs.readFileSync('/etc/letsencrypt/live/mdkp.me/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/mdkp.me/fullchain.pem')
// }, app)

const mongooseConnection = mongoose.connect(DB, { useMongoClient: true }, err => {
  !err ? console.log('Connect To Database -----------------------<') : console.log(err)
})

let sess = {
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {},
  store: new mongoStore({ mongooseConnection: mongooseConnection })
}

app.use(session(sess))
app.use(bodyParser.json({ limit: "4mb" }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))

app.use('/', routes)
app.use('/', express.static('public/client'))
app.use('/', express.static('public/uploads'));
app.use('/dashboard', express.static('public/dashboard'))

server.listen(3000, () => console.log('start in ' + NODE_ENV + ' environment on 443 '))
// server.listen(443, () => console.log('start in ' + NODE_ENV + ' environment on 443 '))

