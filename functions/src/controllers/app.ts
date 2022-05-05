/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as xml from 'xml';
import fetch from 'cross-fetch';
import * as config from '../config/config';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

import * as cors from 'cors';
const corsHandler = cors({origin: true});

const getAppXML = async (req:functions.https.Request, res: functions.Response) => {
    const header = req.headers;
    const xBinu = header['x-binu'] ?? '';

    let indexOfDid = xBinu.indexOf('did');
    indexOfDid = indexOfDid + 4;
    let indexOfAppId = xBinu.indexOf('appId');
    indexOfAppId = indexOfAppId - 2;
    const id = xBinu.toString().substring(indexOfDid, indexOfAppId);


    try {
        let uid = '';

        if (id == '97618f4b0cec4667' || id == ':"0727779845"') {
            uid = '3790bf43-5193-4232-b4cd-3e7b30d1a128';
        } else {
            uid = '3c3a544e-4008-4a19-96e1-38ff7afc67e1';
        }

        console.log(uid);
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.MOYA_API_KEY}`,
            },
        };

        const result = await fetch(`${config.MOYA_API_URL}${uid}`, options);
        const json = await result.json();

        uid = json.user_profile.number;

        const doc = await admin.firestore()
        .collection(util.FunctionsConstants.Users)
        .doc(uid)
        .get();

        const app = [{
            app: [
                {
                    _attr: {
                        styleurl: '',
                        showfree: false,
                        title: util.FunctionsConstants.UmtuWam,
                    },
                },
                {
                    bottom_nav: [
                        {
                            menuItem: [
                                {
                                    _attr: {
                                        default: true,
                                        img: 'https://umtuwam.web.app/logo.png',
                                        href: doc.exists ?`https://us-central1-umtuwam.cloudfunctions.net/getProspectiveDatesXML?id=${uid}` : `https://us-central1-umtuwam.cloudfunctions.net/getStartup?id=${uid}`,
                                    },
                                },
                                util.FunctionsConstants.Home,
                            ],
                        },
                        {
                            menuItem: [
                                {
                                    _attr: {
                                        img: 'https://umtuwam.web.app/chat_logo.png',
                                        href: doc.exists ?`https://us-central1-umtuwam.cloudfunctions.net/getMatchesXML?id=${uid}` : `https://us-central1-umtuwam.cloudfunctions.net/getStartup?id=${uid}`,
                                    },
                                },
                                util.FunctionsConstants.Chats,
                            ],
                        },
                        {
                            menuItem: [
                                {
                                    _attr: {
                                        img: 'https://umtuwam.web.app/filter_1.png',
                                        href: doc.exists ?`https://us-central1-umtuwam.cloudfunctions.net/getPreferencesView?id=${uid}` : `https://us-central1-umtuwam.cloudfunctions.net/getStartup?id=${uid}`,
                                    },
                                },
                                util.FunctionsConstants.PreferencesCapital,
                            ],
                        },
                        {
                            menuItem: [
                                {
                                    _attr: {
                                        img: 'https://umtuwam.web.app/profile_logo.png',
                                        href: doc.exists ?`https://us-central1-umtuwam.cloudfunctions.net/getProfileView?id=${uid}` : `https://us-central1-umtuwam.cloudfunctions.net/getStartup?id=${uid}`,
                                    },
                                },
                                util.FunctionsConstants.Profile,
                            ],
                        },
                    ],
                },
                {
                    menu: [
                        {
                            menuItem: [
                                {
                                    _attr: {
                                        action: util.FunctionsConstants.Usage,
                                    },
                                },
                                util.FunctionsConstants.About,
                            ],
                        },
                        {
                            menuItem: [
                                {
                                    _attr: {
                                        action: util.FunctionsConstants.Share,
                                    },
                                },
                                util.FunctionsConstants.ShareMoya,
                            ],
                        },
                        {
                            menuItem: [
                                {
                                    _attr: {
                                        action: util.FunctionsConstants.Rate,
                                    },
                                },
                                util.FunctionsConstants.RateMoya,
                            ],
                        },
                    ],
                },
                {
                    share: {
                        _attr: {
                            action: util.FunctionsConstants.Send,
                            title: util.FunctionsConstants.Moya,
                            text: util.FunctionsConstants.MoyaShareText,
                            subject: util.FunctionsConstants.MoyaSubjectText,
                        },
                    },
                },
            ],
        }];

        corsHandler(req, res, async () => {
            res.status(200).send(xml(app, true));
            return;
        });
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);

        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const getStartup = async (req:functions.https.Request, res: functions.Response) => {
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
                                href: `https://umtuwam.web.app/Startup.html?did=${uid}`,
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
};

const getPreferencesView = async (req:functions.https.Request, res: functions.Response) => {
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
                                href: `https://umtuwam.web.app/Filters.html?did=${uid}`,
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
};

const getProfileView = async (req:functions.https.Request, res: functions.Response) => {
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
                                href: `https://umtuwam.web.app/Profile.html?did=${uid}`,
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
};

const viewUserProfile = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const queryId = req.query.id ?? '';
        const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
        const did = formattedId.toString();

        const queryUid = req.query.uid ?? '';
        const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
        const uid = formattedUid.toString();
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
                                href: `https://umtuwam.web.app/ViewProfile.html?did=${did}&uid=${uid}`,
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
};

const viewChatProfile = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const queryId = req.query.did ?? '';
        const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
        const did = formattedId.toString();

        const queryUid = req.query.uid ?? '';
        const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
        const uid = formattedUid.toString();

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
                                href: `https://umtuwam.web.app/ViewChatProfile.html?did=${did}&uid=${uid}`,
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
};

const getImageView = async (req:functions.https.Request, res: functions.Response) => {
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

        res.send(xml(doc, true));
        return;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const getMembershipPageXML = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        const queryId = req.query.id ?? '';
        const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
        const uid = formattedId.toString();

        const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

        if (!userDocument.exists) res.status(500).send(util.ErrorMessages.NoUserError);

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
                                        href: `https://us-central1-umtuwam.cloudfunctions.net/createMySubscription?id=${userDocument.id}&productId=${util.Products.Chats}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: `${util.FunctionsConstants.Chatting}: ${util.FunctionsConstants.ClickToPayChats}`,
                                },
                            ],
                        },
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: `https://us-central1-umtuwam.cloudfunctions.net/createMySubscription?id=${userDocument.id}&productId=${util.Products.Boost}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: `${util.FunctionsConstants.Boost}: ${util.FunctionsConstants.ClickToPayFeatured}`,
                                },
                            ],
                        },
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: `https://us-central1-umtuwam.cloudfunctions.net/createMySubscription?id=${userDocument.id}&productId=${util.Products.Photos}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: `${util.FunctionsConstants.SeeAllPhotos}: ${util.FunctionsConstants.ClickToPayPhotos}`,
                                },
                            ],
                        },
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: `https://us-central1-umtuwam.cloudfunctions.net/createMySubscription?id=${userDocument.id}&productId=${util.Products.Verified}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: `${util.FunctionsConstants.Verified}: ${util.FunctionsConstants.ClickToPayVerified}`,
                                },
                            ],
                        },
                    ],
                },
            ],
        }];

        res.status(200).send(xml(doc, true));
        return;
    });
};

const getProspectiveDates = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    res.status(500).send(util.ErrorMessages.NoUserError);
                    return;
                }

                await admin.firestore().collection(util.FunctionsConstants.Users)
                    .where(util.FunctionsConstants.Gender, '==', doc.data()?.gender)
                    .where(util.FunctionsConstants.Age, '>=', doc.data()?.ageMin)
                    .where(util.FunctionsConstants.Age, '<=', doc.data()?.ageMax)
                    .where(util.FunctionsConstants.Location, '==', doc.data()?.location)
                    .orderBy(util.FunctionsConstants.Age, 'asc')
                    .orderBy(util.FunctionsConstants.Points, 'desc')
                    .startAt(doc.data()?.currentIndex)
                    .limit(20)
                    .get()
                    .then(async (docs) => {
                        if (docs.empty) {
                            doc.ref.update({currentIndex: 0});
                            res.status(500).send(util.ErrorMessages.NoDatesMessage);
                            return;
                        } else {
                            const docsArray = [];
                            for (const doc of docs.docs) {
                                docsArray.push(doc.data());
                            }

                            const currentIndex = doc.data()?.currentIndex + docs.docs.length;

                            await doc.ref.update({
                                currentIndex: currentIndex,
                            });


                            res.status(200).send(docsArray);
                            return;
                        }
                    });
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
};

const getProspectiveDatesXML = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            console.log(uid);

            await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).get()
            .then(async (document) => {
                if (!document.exists) {
                    res.status(500).send(util.ErrorMessages.NoUserError);
                    return;
                }

                let docs;
                if (document.data()?.currentIndex == '') {
                    docs = await admin.firestore().collection(util.FunctionsConstants.Users)
                    .where(util.FunctionsConstants.Gender, '==', document.data()?.gender)
                    .where(util.FunctionsConstants.Age, '>=', document.data()?.ageMin)
                    .where(util.FunctionsConstants.Age, '<=', document.data()?.ageMax)
                    .where(util.FunctionsConstants.Location, '==', document.data()?.location)
                    .orderBy(util.FunctionsConstants.Age, 'asc')
                    .orderBy(util.FunctionsConstants.Points, 'desc')
                    .limit(20)
                    .get();
                } else {
                    const lastVisible = await admin.firestore().collection(util.FunctionsConstants.Users).doc(document.data()?.currentIndex).get();

                    if (!lastVisible.exists) {
                        res.status(500).send(util.ErrorMessages.NoUserError);
                        return;
                    }

                    docs = await admin.firestore().collection(util.FunctionsConstants.Users)
                    .where(util.FunctionsConstants.Gender, '==', document.data()?.gender)
                    .where(util.FunctionsConstants.Age, '>=', document.data()?.ageMin)
                    .where(util.FunctionsConstants.Age, '<=', document.data()?.ageMax)
                    .where(util.FunctionsConstants.Location, '==', document.data()?.location)
                    .orderBy(util.FunctionsConstants.Age, 'asc')
                    .orderBy(util.FunctionsConstants.Points, 'desc')
                    .startAfter(lastVisible)
                    .limit(20)
                    .get();
                }

                const usersList: any = [];

                for (const doc of docs.docs) {
                    const item = {
                        item: [
                            {
                                _attr: {
                                    style: '',
                                    href: `https://us-central1-umtuwam.cloudfunctions.net/viewUserProfile?id=${doc.id}&uid=${uid}`,
                                    layout: 'relative',
                                },
                            },
                            {
                                img: {
                                    _attr: {
                                        url: doc.data().images.length > 0 ? doc.data().images[0] : util.FunctionsConstants.DefualtImage,
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
                                   `${doc.data().name} ${doc.data().age}
                                    ${doc.data().location}
                                   `,
                                ],
                            },
                        ],
                    };
                    usersList.push(item);
                }

                if (docs.docs.length == 2) {
                    const currentIndex = docs.docs[docs.docs.length - 1].id;
                    await document.ref.update({currentIndex: currentIndex});
                } else {
                    await document.ref.update({currentIndex: ''});
                }

                const newUsersList = addNextButtonItemXML(usersList, uid);

                const docXML = [{
                    doc: [
                        {
                            _attr: {
                                title: util.FunctionsConstants.Binu,
                            },
                        },
                        {
                            list: [
                                ...newUsersList,
                            ],
                        },
                    ],
                }];

                res.status(200).send(xml(docXML, true));
                return;
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
};

function addNextButtonItemXML(itemsArray:any [], uid: string) {
    const item = {
        item: [
            {
                img: {
                    _attr: {
                        url: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fnext_button.png?alt=media&token=cc78d78b-dac0-4d58-b1a4-f8173ab6846a',
                    },
                },
            },
            {
                _attr: {
                    style: '',
                    href: `https://us-central1-umtuwam.cloudfunctions.net/getProspectiveDatesXML?id=${uid}`,
                    layout: 'relative',
                },
            },
            {
                md: [
                    {
                        _attr: {
                            style: '',
                        },
                    },
                    util.FunctionsConstants.Next,
                ],
            },
        ],
    };
    itemsArray.push(item);
    return itemsArray;
}

export {
    getAppXML,
    getStartup,
    getImageView,
    getProfileView,
    viewUserProfile,
    viewChatProfile,
    getPreferencesView,
    getProspectiveDates,
    getMembershipPageXML,
    getProspectiveDatesXML,
};
