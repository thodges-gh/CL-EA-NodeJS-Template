import { Callback, Context } from 'aws-lambda';
import { IRequesterResponse, getValidatorWrapper, IRequestInput, ICustomError, RequesterRequestWrapper, RequesterErroredWrapper } from './types/chainlink-adapter'

interface ICreateRequestResponse extends IRequesterResponse {
  jobRunID: string;
}

export const createRequest = async (input: IRequestInput): Promise<ICreateRequestResponse> => {
  var jobRunID = ''
  try {
    const customParams = {
      tokenIdInt: 'tokenIdInt',
      tickSet: 'tickSet',
    };
    const validator = getValidatorWrapper(input, customParams);
    jobRunID = validator.validated.id;

    const config = {
      url: 'https://xzff24vr3m.execute-api.us-east-2.amazonaws.com/default/spectral-proxy/',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'XYpX4gaNaCafgAzdBpQyaLrF34N0Qp71N6qOwvSh',
      },
      data: `{\"tokenInt\":\"${validator.validated.data.tokenIdInt}\"}`,
      method: 'POST',
      timeout: 30000,
    };

    const customError = (data: ICustomError) => {
      if (data.Response === 'Error') return true;
      return false;
    };
    const response = await RequesterRequestWrapper(config, customError);
    if (response.data?.length > 0) {
      return { jobRunID, ...response };
    } else {
      throw RequesterErroredWrapper(jobRunID, new Error("Response did not contain score data!"), 400);
    }
  } catch (error) {
    throw RequesterErroredWrapper(jobRunID, error, 500);
  }
};

// This is a wrapper to allow the function to work with newer AWS Lambda implementations
exports.handlerv2 = (event: any, context: Context, callback: Callback) => {
  try {
    var input = JSON.parse(event.body);
  } catch (err) {
    callback(new Error('Error parsing body!'), {
      statusCode: 500,
    });
  }
  createRequest(input)
    .then((result) => {
      callback(null, {
        statusCode: result.status,
        body: JSON.stringify(result.data),
        isBase64Encoded: false,
      });
    })
    .catch((error) => {
      callback(error, {
        statusCode: error?.statusCode ?? 500,
      });
    });
};
