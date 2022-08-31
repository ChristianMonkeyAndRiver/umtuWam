import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const data = req.body;

        const queryId = req.query.id ?? '';
        const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
        const uid = formattedId.toString();

        const buffer = Buffer.from(data);

        await admin
            .firestore()
            .collection(util.FunctionsConstants.Users)
            .doc(uid)
            .get()
            .then(async (doc) => {
                if (!doc.exists) {
                    res.status(404).send(util.ErrorMessages.NoUserError);
                    return;
                }
                // if (doc.data()?.images.length == 5) {
                //     res.status(500).send(util.ErrorMessages.TooManyImagesError);
                //     return;
                // }
                let imageArrayLength = doc.data()?.images.length;
                if (imageArrayLength == 0) {
                    imageArrayLength += 1;
                } else {
                    const imageArr = doc.data()?.images;
                    const lastImg = imageArr[imageArrayLength - 1] + '';
                    const noParams = lastImg.split('?')[0];
                    const splitUrl = noParams.split('/');
                    splitUrl.forEach((element) => {
                        if (element.includes('profile_photo')) {
                            imageArrayLength = parseInt(element.split('_')[2].split('.')[0]) + 1;
                        }
                    });
                }

                const filename = `images/users/${uid}/profile_photo_${imageArrayLength}.jpeg`;
                const bucket = admin.storage().bucket();
                const file = bucket.file(filename);

                const options = {
                    resumable: false,
                    metadata: { contentType: 'image/jpeg' },
                };

                return file
                    .save(buffer, options)
                    .then(() => {
                        return file.getSignedUrl({
                            action: 'read',
                            expires: '03-09-2500',
                        });
                    })
                    .then((urls) => {
                        const url = urls[0];
                        doc.ref.update({
                            images: admin.firestore.FieldValue.arrayUnion(url),
                        });
                        res.send(util.SuccessMessages.SuccessMessage);
                        return;
                    });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send(util.ErrorMessages.UnexpectedError);
                return;
            });
    });
});
