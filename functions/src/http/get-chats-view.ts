import * as cors from 'cors';
import * as xml from 'xml';
import * as admin from 'firebase-admin';
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

            const document = await admin.firestore()
                .collection(util.FunctionsConstants.Users)
                .doc(id)
                .get();

            if (!document.exists) {
                res.status(404).send(util.ErrorMessages.NoUserError);
                return;
            }

            const now = admin.firestore.Timestamp.now();

            const chatTimeDiff = now.seconds - document.data()?.chatsAndPhotosExpiryDate.seconds ?? 0;
            const daysDifference = Math.floor(chatTimeDiff / 1000 / 60*30);
            const isChatAndPhotosSubscriptionValid = (document.data()?.hasPaidForChatsAndPhotos && daysDifference < 0);


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
                                    href: isChatAndPhotosSubscriptionValid ? `https://umtuwam.web.app/Chats.html?id=${id}&uid=${uid}` : `https://umtuwam.web.app/Payment.html?id=${id}&uid=${uid}&product=${util.Products.ChatsAndPhotos}&isMine=${true}&amount=${util.Prices.ChatsAndPhotos}`,
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
