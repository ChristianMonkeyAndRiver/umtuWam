import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

import * as cors from 'cors';
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

            const queryTitle = req.query.title ?? '';
            const formattedTitle = Array.isArray(queryTitle) ? queryTitle[0] : queryTitle;
            const title = formattedTitle.toString();

            const queryContent = req.query.content ?? '';
            const formattedContent = Array.isArray(queryContent) ? queryContent[0] : queryContent;
            const content = formattedContent.toString();

            const now = admin.firestore.Timestamp.now();
            await admin.firestore().collection(util.FunctionsConstants.Reports).doc().set({
                reporterId: id,
                transgressorId: uid,
                title: title,
                content: content,
                timestamp: now,
            });

            res.set('Content-Type', 'application/xml');
            res.status(200).send(util.SuccessMessages.SuccessMessage);
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
