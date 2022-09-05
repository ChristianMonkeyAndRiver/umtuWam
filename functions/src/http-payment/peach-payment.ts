/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as https from 'https';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import querystring = require('querystring');

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    const queryAmount = req.query.amount ?? 0;
    const formattedAmount = Array.isArray(queryAmount) ? queryAmount[0] : queryAmount;
    const amountToParse = formattedAmount.toString();
    const amount = Number.parseFloat(amountToParse) / 100.0;

    corsHandler(req, res, async () => {
        const request = async () => {
            // const path = 'https://eu-prod.oppwa.com/v1/checkouts';
            const path = '/v1/checkouts';
            const data = querystring.stringify({
                'entityId': '8ac9a4ce81f6a88f018216412bfc206b',
                'amount': amount,
                'currency': 'ZAR',
                'paymentType': 'DB',
            });
            // const data = querystring.stringify({
            //     'entityId': '8ac7a4c981a409ed0181a5ce03740312',
            //     'amount': amount,
            //     'currency': 'ZAR',
            //     'paymentType': 'DB',
            // });
            // const options = {
            //     port: 443,
            //     host: 'eu-test.oppwa.com',
            //     path: path,
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'Content-Length': data.length,
            //         'Authorization': 'Bearer OGFjN2E0Y2E4MWE0MTNmMjAxODFhNWNkZmYyNjA1MjB8WENaUVRlRDVOWQ==',
            //     },
            // };
            const options = {
                port: 443,
                host: 'eu-prod.oppwa.com',
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': data.length,
                    'Authorization': 'Bearer OGFjOWE0Y2Q4MWY2OTliOTAxODIxNjE3MGMxYzEwM2Z8YjQyY0FNNWtweg==',
                },
            };
            // const options = {
            //     port: 443,
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'Content-Length': JSON.stringify(data.length),
            //         'Authorization': 'Bearer OGFjOWE0Y2Q4MWY2OTliOTAxODIxNjE3MGMxYzEwM2Z8YjQyY0FNNWtweg==',
            //     },
            //     body: data,
            // };
            // const response = await fetch(path, options);
            // return response.json();

            return new Promise((resolve, reject) => {
                const postRequest = https.request(options, function (response: any) {
                    const buf: any[] = [];
                    response.on('data', (chunk: any) => {
                        buf.push(Buffer.from(chunk));
                    });
                    response.on('end', () => {
                        const jsonString = Buffer.concat(buf).toString('utf8');
                        try {
                            resolve(JSON.parse(jsonString));
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                postRequest.on('error', reject);
                postRequest.write(data);
                postRequest.end();
            });
        };

        request()
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((error) => {
                res.status(404).send(error);
                return;
            });
    });
});
