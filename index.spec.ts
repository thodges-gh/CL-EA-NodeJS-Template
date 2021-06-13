import { createRequest } from './index';
import { IRequestInput } from './types/chainlink-adapter';

describe('createRequest', () => {
  const requestTimeout = 25000;
  const jobID = '1';

  const tests = [
    {
      name: 'standard request should succeed',
      shouldFail: false,
      testData: {
        id: jobID,
        data: {
          tokenIdInt: '42747786677057537933777365201756780713494970703527385451017290874280990481333',
          tickSet: '1',
        },
      },
    },
    // { name: 'empty body should fail', testData: {}, shouldFail: true },
    // { name: 'empty data should fail', testData: { data: {} }, shouldFail: true },
  ];

  tests.forEach((test) => {
    if (test.shouldFail) {
      it(
        `${test.name}`,
        () => {
          expect(async () => {
            await createRequest(test.testData as IRequestInput);
          }).toThrow();
        },
        requestTimeout,
      );
    } else {
      it(
        `${test.name}`,
        async () => {
          const result = await createRequest(test.testData as IRequestInput);
          expect(result.status).toEqual(200);
          expect(result.jobRunID).toEqual(jobID);
          expect(Array.isArray(result.data)).toBeTruthy();
          expect(result.data.length).toBeGreaterThan(0);
        },
        requestTimeout,
      );
    }
  });
});
