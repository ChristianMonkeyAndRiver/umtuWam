/* eslint-disable @typescript-eslint/no-explicit-any */
import * as https from 'https';
import * as cors from 'cors';
import * as querystring from 'querystring';
// import * as config from '../config/config';
// import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
// import * as util from '../utils/constants';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    // const queryId = req.query.id ?? '';
    // const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
    // const id = formattedId.toString();

    const queryAmount = req.query.amount ?? '';
    const formattedAmount = Array.isArray(queryAmount) ? queryAmount[0] : queryAmount;
    const amount = formattedAmount.toString();

    corsHandler(req, res, async () => {
        const request = async () => {
            const path='/v1/checkouts';
            const data = querystring.stringify({
                'entityId': '8ac7a4c981a409ed0181a5ce03740312',
                'amount': amount,
                'currency': 'ZAR',
                'paymentType': 'DB',
            });
            const options = {
                port: 443,
                host: 'eu-test.oppwa.com',
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': data.length,
                    'Authorization': 'Bearer OGFjN2E0Y2E4MWE0MTNmMjAxODFhNWNkZmYyNjA1MjB8WENaUVRlRDVOWQ==',
                },
            };
            return new Promise((resolve, reject) => {
                const postRequest = https.request(options, function(response: any) {
                    const buf: any[] = [];
                    response.on('data', (chunk:any) => {
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

        request().then((result) => {
            res.status(200).send(result);
        }).catch((error) => {
            res.status(404).send(error);
            return;
        });
    });
});
