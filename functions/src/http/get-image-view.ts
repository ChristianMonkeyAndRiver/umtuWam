import * as cors from 'cors';
import * as xml from 'xml';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();
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
                                    href: `https://umtuwam.web.app/Image.html?id=${uid}`,
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
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
