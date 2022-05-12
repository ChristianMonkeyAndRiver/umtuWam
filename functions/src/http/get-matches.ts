import * as xml from 'xml';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats)
                .get()
                .then((docs) => {
                    if (docs.empty) {
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
                                                href: 'https://umtuwam.web.app/Empty.html',
                                                internal: 'true',
                                            },
                                        },
                                    ],
                                },
                            ],
                        }];

                        res.send(xml(doc, true));
                        return;
                    }

                    const docsArray = [];
                    for (const doc of docs.docs) {
                        docsArray.push(doc.data());
                    }


                    res.status(200).send(docsArray);
                    return;
                });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
});
