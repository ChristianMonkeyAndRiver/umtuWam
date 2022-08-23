/* eslint-disable @typescript-eslint/no-explicit-any */
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

            res.set('Content-Type', 'application/xml');
            res.send(xml(doc, true));
                    return;
                }

                const usersList: any = [];
                for (const doc of docs.docs) {
                    const item = {
                        item: [
                            {
                                _attr: {
                                    style: '',
                                    href: `https://us-central1-umtuwam.cloudfunctions.net/http-viewChatProfile?did=${doc.data().id}&uid=${uid}`,
                                    layout: 'relative',
                                },
                            },
                            {
                                img: {
                                    _attr: {
                                        url: doc.data().imageUrl != '' ? doc.data().imageUrl : util.FunctionsConstants.DefaultImage,
                                    },
                                },
                            },
                            {
                                md: [
                                    {
                                        _attr: {
                                            style: '',
                                        },
                                    },
                                    doc.data().name,
                                ],
                            },
                        ],
                    };
                    usersList.push(item);
                }

                const doc = [{
                    doc: [
                        {
                            _attr: {
                                title: util.FunctionsConstants.Binu,
                            },
                        },
                        {
                            list: [
                                ...usersList,
                            ],
                        },
                    ],
                }];


            res.set('Content-Type', 'application/xml');
            res.send(xml(doc, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
                return;
            })
            .catch((error) => {
                console.error(error);
                res.status(404).send(util.ErrorMessages.UnexpectedError);
                return;
            });
    });
});
