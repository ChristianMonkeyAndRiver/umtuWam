import * as xml from 'xml';
import * as cors from 'cors';
import * as util from '../utils/constans';
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

                console.log(' ================= Preferences =================');
                console.log(uid);
                console.log(' ================= Preferences =================');

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
                                    href: document.exists ? `https://us-central1-umtuwam.cloudfunctions.net/http-getPreferencesView?id=${document.id}` : `https://umtuwam.web.app/Startup.html?did=${uid}`,
                                    internal: 'true',
                                },
                            },
                        ],
                    },
                ],
            }];

            res.send(xml(doc, true));
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
});
