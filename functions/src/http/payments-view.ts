import * as xml from 'xml';
import * as cors from 'cors';
import * as util from '../utils/constants';
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

            const queryProduct = req.query.product ?? '';
            const formattedProduct = Array.isArray(queryProduct) ? queryProduct[0] : queryProduct;
            const productId = formattedProduct.toString();

            const queryIsMine = req.query.isMine ?? '';
            const formattedIsMine = Array.isArray(queryIsMine) ? queryIsMine[0] : queryIsMine;
            const isMine = formattedIsMine.toString();

            const queryIsAmount = req.query.amount ?? '';
            const formattedIsAmount = Array.isArray(queryIsAmount) ? queryIsAmount[0] : queryIsAmount;
            const amount = formattedIsAmount.toString();

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
                                    href: `https://umtuwam.web.app/Payment.html?id=${id}&uid=${uid}&product=${productId}&isMine=${isMine}&amount=${amount}`,
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
