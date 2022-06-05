import * as xml from 'xml';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const queryId = req.query.id ?? '';
        const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
        const uid = formattedId.toString();
        const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

        if (!userDocument.exists) {
            res.status(500).send(util.ErrorMessages.NoUserError);
            return;
        }

        const now = admin.firestore.Timestamp.now();

        const chatTimeDiff = now.seconds - userDocument.data()?.chatsExpiryDate.seconds ?? 0;
        let daysDifference = Math.floor(chatTimeDiff / 1000 / 60);
        const isChatSubscriptionValid = (userDocument.data()?.hasPaidForChats && daysDifference < 0);

        const featuredTimeDiff = now.seconds - userDocument.data()?.featuredExpiryDate.seconds ?? 0;
        daysDifference = Math.floor(featuredTimeDiff / 1000 / 60);
        const isFeaturedSubscriptionValid = (userDocument.data()?.hasPaidForFeatured && featuredTimeDiff < 0);


        const isVerified = userDocument.data()?.isVerified;
        const doc = [{
            doc: [
                {
                    _attr: {
                        title: util.FunctionsConstants.UmtuWam,
                    },
                },
                {
                    list: [
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: '',
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: util.FunctionsConstants.Membership,
                                },
                            ],
                        },
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: isChatSubscriptionValid ? '' : `https://us-central1-umtuwam.cloudfunctions.net/http-paymentsView?id=${uid}}&uid=${''}&product=${util.Products.Chats}&isMine=${true}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: isChatSubscriptionValid ? 'Chat subscription is currently active' : `${util.FunctionsConstants.Chatting}: ${util.FunctionsConstants.ClickToPayChats}`,
                                },
                            ],
                        },
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: isChatSubscriptionValid ? '' : `https://us-central1-umtuwam.cloudfunctions.net/http-paymentsView?id=${uid}}&uid=${''}&product=${util.Products.Chats}&isMine=${true}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: isChatSubscriptionValid ? 'Chat subscription is currently active' : `${util.FunctionsConstants.Chatting}: ${util.FunctionsConstants.ClickToPayChatsMonth}`,
                                },
                            ],
                        },
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: isFeaturedSubscriptionValid ? '' : `https://us-central1-umtuwam.cloudfunctions.net/http-paymentsView?id=${uid}&uid=${''}&product=${util.Products.Boost}&isMine=${true}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: isFeaturedSubscriptionValid ? 'Boost subscription is currently active' : `${util.FunctionsConstants.Boost}: ${util.FunctionsConstants.ClickToPayFeatured}`,
                                },
                            ],
                        },
                        !isVerified ? {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: `https://us-central1-umtuwam.cloudfunctions.net/http-paymentsView?id=${uid}&uid=${''}&product=${util.Products.Verified}&isMine=${true}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: `${util.FunctionsConstants.Verified}: ${util.FunctionsConstants.ClickToPayVerified}`,
                                },
                            ],
                        } : {},
                    ],
                },
            ],
        }];
        res.status(200).send(xml(doc, true));
        return;
    });
});
