/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as xml from 'xml';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

import * as cors from 'cors';
const corsHandler = cors({origin: true});


const getAppXML = async (req:functions.https.Request, res: functions.Response) => {
    // const queryId = req.
    // const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
    // const uid = formattedId.toString();
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
                                    defualt: true,
                                    img: 'https://umtuwam.web.app/logo.png',
                                    href: 'https://us-central1-umtuwam.cloudfunctions.net/getStartup',
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
                                    href: 'https://umtuwam.web.app/Chats.xml',
                                },
                            },
                            util.FunctionsConstants.Chats,
                        ],
                    },
                    {
                        menuItem: [
                            {
                                _attr: {
                                    img: 'https://umtuwam.web.app/settings.png',
                                    href: 'https://umtuwam.web.app/Filters.xml',
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
                                    href: 'https://umtuwam.web.app/Profile.xml',
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
};

const getStartup = async (req:functions.https.Request, res: functions.Response) => {
    try {
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
                                style: '',
                                layout: 'relative',
                                href: 'https://umtuwam.web.app/Startup.html',
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
                                        href: '',
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
                                        href: '',
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: `${util.FunctionsConstants.Featured} ${util.FunctionsConstants.ClickToPayFeatured}`,
                                },
                            ],
                        },
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
                                    md: `${util.FunctionsConstants.SeeAllPhotos} ${util.FunctionsConstants.ClickToPayPhotos}`,
                                },
                            ],
                        },
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
                                    md: `${util.FunctionsConstants.Verified} ${util.FunctionsConstants.ClickToPayVerified}`,
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
                    }

                    const usersList: any = [];

                    for (const doc of docs.docs) {
                        const item = {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: `http://localhost:5001/umtuwam/us-central1/getUserProfileXML?uid=${doc.id}`,
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
                                        {
                                            p: {
                                                _cdata: doc.data().name,
                                            },
                                        },
                                        {
                                            p: {
                                                _cdata: doc.data().age,
                                            },
                                        },
                                        {
                                            p: {
                                                _cdata: doc.data().location,
                                            },
                                        },
                                    ],
                                },
                                {
                                    item: [
                                        {
                                            _attr: {
                                                style: '',
                                                href: `http://localhost:5001/umtuwam/us-central1/likeUser?uid=${doc.id}`,
                                                layout: 'relative',
                                            },
                                        },
                                    ],
                                },
                            ],
                        };
                        usersList.push(item);
                    }

                    const currentIndex = doc.data()?.currentIndex + docs.docs.length;

                    await doc.ref.update({
                        currentIndex: currentIndex,
                    });

                    const newUsersList = addNextButtonItemXML(usersList);

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
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
};

const getUserProfileXML = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        const queryUid = req.query.uid ?? '';
        const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
        const uidString = formattedUid.toString();


        await admin.firestore().collection(util.FunctionsConstants.Users).doc(uidString).get()
         .then((docs) =>{
            if (!docs.exists) return res.status(500).send(util.ErrorMessages.NoUserError);

                const doc = [{
                    doc: [
                        {
                            _attr: {
                                title: util.FunctionsConstants.Binu,
                            },
                        },
                        {
                            img: {
                                _attr: {
                                    url: docs.data()?.images.length > 0 ? docs.data()?.images[0] : util.FunctionsConstants.DefualtImage,
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
                                {
                                    p: {
                                        _cdata: docs.data()?.name,
                                    },
                                },
                                {
                                    p: {
                                        _cdata: docs.data()?.age,
                                    },
                                },
                            ],
                        },
                        {
                            md: [
                                {
                                    _attr: {
                                        style: '',
                                    },
                                },
                                {
                                    p: {
                                        _cdata: docs.data()?.location,
                                    },
                                },
                            ],
                        },
                        {
                            md: [
                                {
                                    _attr: {
                                        style: '',
                                    },
                                },
                                {
                                    p: {
                                        _cdata: docs.data()?.bio,
                                    },
                                },
                            ],
                        },
                    ],
                }];

            res.send(xml(doc, true));
            return;
        })
        .catch((error) => {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        });
    });
};

function addNextButtonItemXML(itemsArray:any [] ) {
    const item = {
        item: [
            {
                _attr: {
                    style: '',
                    href: 'http://localhost:5001/umtuwam/us-central1/getProspectiveDatesXML&start_index=40',
                    layout: 'relative',
                },
            },
            {
                img: {
                    _attr: {
                        url: util.FunctionsConstants.NextImage,
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
                    {
                        p: {
                            _cdata: util.FunctionsConstants.Next,
                        },
                    },
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
    getUserProfileXML,
    getProspectiveDates,
    getMembershipPageXML,
    getProspectiveDatesXML,
};
