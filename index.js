const { Requester, Validator } = require('@chainlink/external-adapter');
const { response } = require('express');
// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}



// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  tokenIdInt: ['tokenIdInt'],
  tickSet: ['tickSet']
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  console.log(validator.validated.data)
  const jobRunID = validator.validated.id
  const tokenIdInt = validator.validated.data.tokenIdInt;
  const tickSet= validator.validated.data.tickSet;
  const url = `https://xzff24vr3m.execute-api.us-east-2.amazonaws.com/default/spectral-proxy/`

  const config = {
    url,
    headers: {
      'Content-Type': 'application/json',                                                                                                                                                                                                                                                                                                                                                                                                                                                      
      'x-api-key': 'XYpX4gaNaCafgAzdBpQyaLrF34N0Qp71N6qOwvSh' 
    },
    data: `{\"tokenInt\":\"${tokenIdInt}\"}`,
    method: "POST"
  }

  console.log(config)
  
  Requester.request(config, customError)
    .then(response => {
      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
