import * as xml from 'xml';
import * as cors from 'cors';
import * as util from '../utils/constants';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const document = await admin.firestore()
                .collection(util.FunctionsConstants.Users)
                .doc(uid)
                .get();

            const randomKey = Math.floor(Math.random() * 100);

            const doc = [{
                doc: [
                    {
                        _attr: {
                            title: util.FunctionsConstants.UmtuWam,
                        },
                    },
                    {
                        webview: [
                            {
                                _attr: {
                                    href: document.exists ? `https://us-central1-umtuwam.cloudfunctions.net/http-getProspectiveDatesXml?id=${document.id}&isNextPressed=${0}&randomKey=${randomKey}` : `https://umtuwam.web.app/Startup.html?did=${uid}&randomKey=${randomKey}`,
                                    internal: 'true',
                                },
                            },
                        ],
                    },
                ],
            }];
            res.set('Content-Type', 'application/xml');
            res.send(xml(doc, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
            return;
        } catch (error) {
            console.error(error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
