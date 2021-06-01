const { Requester, Validator } = require('@chainlink/external-adapter');
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
  action: ['addresses', 'job_type'],
  value: ['job_id','bucket'],
  endpoint: false

}


const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const action = validator.validated.data.action;
  const value= validator.validated.data.value;
  
  var endpoint;
  
  if(action == 'addresses'&& action =='jon_type'){
    endpoint = `submit=${value}`
  } else
    endpoint = `resolve/jobid=${value}`
  const url = ` http://18.191.166.107/api/${endpoint}`
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

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
  .then(response => {
    // first time posts to address-db, returns addresses
    // need to add error checks for address-db failed call and submit failed call
      post("http://18.191.166.107/api/submit/",addresses,job_type).then(response =>{
        get("http://18.191.166.107/api/resolve/",job_id).then(response =>{
          let jobState = response.end
          while(response.end == false) {
            jobState = get("http://18.191.166.107/api/resolve/",job_id).then(response => {
              return response.end
            })
          }
        }) 
        response.data.result = Requester.validateResultNumber(response.data, ['score','bucket'])       
      })
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
