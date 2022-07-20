/* eslint-disable @typescript-eslint/no-explicit-any */
import * as https from 'https';
import * as functions from 'firebase-functions';

export default functions.https.onRequest(async (req, res) => {
    // const queryId = req.query.checkoutId ?? '';
    // const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
    // const id = formattedId.toString();

    const request = async () => {
        let path='/v1/query/8a82944a4cc25ebf014cc2c782423202';
        path += '?entityId=8ac7a4c981a409ed0181a5ce03740312';
        const options = {
            port: 443,
            host: 'eu-test.oppwa.com',
            path: path,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer OGFjN2E0Y2E4MWE0MTNmMjAxODFhNWNkZmYyNjA1MjB8WENaUVRlRDVOWQ==',
            },
        };
        return new Promise((resolve, reject) => {
            const postRequest = https.request(options, function(res) {
                const buf: any[] = [];
                res.on('data', (chunk) => {
                    buf.push(Buffer.from(chunk));
                });
                res.on('end', () => {
                    const jsonString = Buffer.concat(buf).toString('utf8');
                    try {
                        resolve(JSON.parse(jsonString));
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            postRequest.on('error', reject);
            postRequest.end();
        });
    };

    request()
    .then((result) => {
        res.status(200).send(result);
    })
    .catch((error) =>{
        res.status(400).send(error);
    });
});
