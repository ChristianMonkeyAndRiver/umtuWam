/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as xml from 'xml';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

const getAppXML = async (req:functions.https.Request, res: functions.Response) => {
    const app = [{
        app: [
            {
                _attr: {
                    // logo: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Flogo.png?alt=media&token=4fc9ed08-3832-4727-a2aa-717cda834193',
                    styleurl: '',
                },
            },
            {
                bottom_nav: [
                    {
                        menuItem: [
                            {
                                _attr: {
                                    // img: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Flogo.png?alt=media&token=4fc9ed08-3832-4727-a2aa-717cda834193',
                                    href: '',
                                },
                            },
                            util.FunctionsConstants.UmtuWam,
                        ],
                    },
                    {
                        menuItem: [
                            {
                                _attr: {
                                    // img: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fchat_logo.png?alt=media&token=55adfc03-d2b8-4b65-bf26-707f4cd5cd16',
                                    href: '',
                                },
                            },
                            util.Products.Chats,
                        ],
                    },
                    {
                        menuItem: [
                            {
                                _attr: {
                                    // img: util.FunctionsConstants.DefualtImage,
                                    href: '',
                                },
                            },
                            'Profile',
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

    res.send(xml(app, true));
    return;
};

const getMembershipPageXML = async (req:functions.https.Request, res: functions.Response) => {
    const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
    const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
    const uid = binu.did;

    const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

    if (!userDocument.exists) {
        res.status(400).send(util.ErrorMessages.NoUserError);
        return;
    }

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
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: util.FunctionsConstants.Membership,
                                },
                            },
                        ],
                    },
                    {
                        hr: [],
                    },
                    {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: util.FunctionsConstants.Chatting,
                                },
                            },
                        ],
                    },
                   {
                        a: [
                            {
                                _attr: {
                                    href: '',
                                },
                            },
                            util.FunctionsConstants.ClickToPayChats,
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
                                description: {
                                    _cdata: 'See all photos',
                                },
                            },
                        ],
                    },
                   {
                        a: [
                            {
                                _attr: {
                                    href: '',
                                },
                            },
                            util.FunctionsConstants.ClickToPayPhotos,
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
                                description: {
                                    _cdata: util.FunctionsConstants.Verified,
                                },
                            },
                        ],
                    },
                    {
                        a: [
                            {
                                _attr: {
                                    href: '',
                                },
                            },
                            util.FunctionsConstants.ClickToPayVerified,
                        ],
                    },
                ],
            },
        ],
    }];

    res.send(xml(doc, true));
    return;
};

const getProspectiveDates = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
        const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
        const uid = binu.did;

        await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).get()
        .then(async (doc) => {
            if (!doc.exists) {
                res.status(400).send(util.ErrorMessages.NoUserError);
                return;
            }

            await admin.firestore().collection(util.FunctionsConstants.Users)
                .where(util.FunctionsConstants.Gender, '==', doc.data()?.gender)
                .where(util.FunctionsConstants.Age, '>=', doc.data()?.ageMin)
                .where(util.FunctionsConstants.Age, '<=', doc.data()?.ageMax)
                .where(util.FunctionsConstants.Location, '==', doc.data()?.location)
                .limit(20)
                .get()
                .then((docs) => {
                    if (docs.empty) {
                        res.status(400).send(util.ErrorMessages.NoDatesMessage);
                        return;
                    }

                    const docsArray = [];
                    for (const doc of docs.docs) {
                        docsArray.push(doc.data());
                    }

                    res.status(200).send(docsArray);
                    return;
                });
        });
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const getProspectiveDatesXML = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
        const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
        const uid = binu.did;

        await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).get()
        .then(async (doc) => {
            if (!doc.exists) {
                res.status(400).send(util.ErrorMessages.NoUserError);
                return;
            }

            await admin.firestore().collection(util.FunctionsConstants.Users)
                .where(util.FunctionsConstants.Gender, '==', doc.data()?.gender)
                .where(util.FunctionsConstants.Age, '>=', doc.data()?.ageMin)
                .where(util.FunctionsConstants.Age, '<=', doc.data()?.ageMax)
                .where(util.FunctionsConstants.Location, '==', doc.data()?.location)
                .limit(20)
                .get()
                .then((docs) => {
                    if (docs.empty) {
                        res.status(400).send(util.ErrorMessages.NoDatesMessage);
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
                                            description: {
                                                _cdata: doc.data().name,
                                            },
                                        },
                                        {
                                            description: {
                                                _cdata: doc.data().age,
                                            },
                                        },
                                        {
                                            description: {
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

                    res.send(xml(doc, true));
                    return;
                });
        });
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const getUserProfileXML = async (req:functions.https.Request, res: functions.Response) => {
    const uidIndex = req.url.indexOf(util.FunctionsConstants.Uid);
    const uidString = req.url.substring(uidIndex+util.FunctionsConstants.Uid.length+1);


    await admin.firestore().collection(util.FunctionsConstants.Users).doc(uidString).get()
     .then((docs) =>{
        if (!docs.exists) return res.status(400).send(util.ErrorMessages.NoUserError);

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
                                description: {
                                    _cdata: docs.data()?.name,
                                },
                            },
                            {
                                description: {
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
                                description: {
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
                                description: {
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
};
export {
    getAppXML,
    getUserProfileXML,
    getProspectiveDates,
    getMembershipPageXML,
    getProspectiveDatesXML,
};
