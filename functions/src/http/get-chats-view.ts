import * as xml from 'xml';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';


export default functions.https.onRequest(async (req, res) => {
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
                                href: document.data()?.hasPaidForChats ? `https://umtuwam.web.app/Chats.html?id=${id}&uid=${uid}` : `https://umtuwam.web.app/Payment.html?id=${id}&uid=${uid}&product=Photos&isMine=${true}`,
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