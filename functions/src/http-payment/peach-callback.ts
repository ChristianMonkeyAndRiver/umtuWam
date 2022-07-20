/* eslint-disable @typescript-eslint/no-explicit-any */
import * as xml from 'xml';
import * as cors from 'cors';
import * as https from 'https';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    const queryId = req.query.checkoutId ?? '';
    const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
    const id = formattedId.toString();

    corsHandler(req, res, async () => {
        const request = async () => {
            let path=`/v1/checkouts/${id}/payment`;
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
            console.log(JSON.stringify(result));
        })
        .catch((error) =>{
            console.error(error);
        });

        const doc = [{
            doc: [
                {
                    _attr: {
                        title: 'Terms',
                    },
                },
                {
                    list: [
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: '## UmtuWam Terms and Conditions',
                                },
                            ],
                        },
                    ],
                },
            ],
        }];
        res.status(200).send(xml(doc, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
    });
});
