import * as xml from 'xml';
import * as cors from 'cors';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const id = formattedId.toString();

            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uid = formattedUid.toString();

            const queryName = req.query.name ?? '';
            const formattedName = Array.isArray(queryName) ? queryName[0] : queryName;
            const name = formattedName.toString();

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
                                    href: `https://umtuwam.web.app/Report.html?did=${id}&uid=${uid}&name=${name}`,
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
