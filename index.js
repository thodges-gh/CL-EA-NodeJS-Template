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
  addresses: ['addresses'],
  job_type: ['job_type'],
  endpoint: false
}


const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const addresses = validator.validated.data.addresses;
  const job_type= validator.validated.data.job_type;
  const endpoint1 = validator.validated.data.endpoint || 'submit';
  const endpoint2 = validator.validated.data.endpoint || 'resolve';
  const id = fetch (`http://18.191.166.107/api/${endpoint1}`,{
    method: 'POST',
    body: json.stringify(customParams),
  })
    .then(response => response.json)
    .then(job_id => console.log(job_id))
  const data = fetch('GET',`http://18.191.166.107/api/${endpoint2}/${id}`)
    .then(response => response.json)
    .then(bucket => console.log(bucket))
//add header
  const headerObj = {
    'Content-Type': 'application/json'
    //public api so no need Aut                                                                                                                                                                                                                                                                                                                                                                                                                                                               horization
    //"Authorization": apiKey 

  };

  const config = {
    url,
    customParams,
    headers: headerObj
  }


  Requester.request(config, customError)
    .then(response => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      response.data.result = Requester.validateResultNumber(response.data, bucket)
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
