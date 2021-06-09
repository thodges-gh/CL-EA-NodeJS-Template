import { Request, Response } from 'express'
import { createRequest } from './index'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8080

app.use(bodyParser.json())
/*app.GET('/', (req, res) => {
  console.log('GET Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})*/
app.post('/', (req: Request, res: Response) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status: any, result: any) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
