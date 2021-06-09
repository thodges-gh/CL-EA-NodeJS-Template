const { Requester, Validator } = require('@chainlink/external-adapter') // no @types packages for this?
import { Callback, Context } from 'aws-lambda'

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data: any) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  tokenIdInt: ['tokenIdInt'],
  tickSet: ['tickSet'],
}

// TODO: add types
export const createRequest = (input: any, callback: any) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  console.log(validator.validated.data)
  const jobRunID = validator.validated.id
  const tokenIdInt = validator.validated.data.tokenIdInt
  const tickSet = validator.validated.data.tickSet
  const url = `https://xzff24vr3m.execute-api.us-east-2.amazonaws.com/default/spectral-proxy/`

  const config = {
    url,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'XYpX4gaNaCafgAzdBpQyaLrF34N0Qp71N6qOwvSh',
    },
    data: `{\"tokenInt\":\"${tokenIdInt}\"}`,
    method: 'POST',
  }

  console.log(config)

  Requester.request(config, customError)
    .then((response: any) => {
      //manage ticksets here
      callback(
        response.status,
        Requester.success(jobRunID, {
          jobRunID: input.id,
          data: { result: response.data },
          statusCode: 200,
        }),
      )
    })
    .catch((error: any) => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event: any, context: Context, callback: Callback) => {
  createRequest(JSON.parse(event.body), (statusCode: number, data: any) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false,
    })
  })
}
