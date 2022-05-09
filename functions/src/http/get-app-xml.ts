import * as xml from 'xml';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as config from '../config/config';
import * as functions from 'firebase-functions';

const corsHandler = cors({origin: true});

export default functions.https.onRequest(async (req, res) => {
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
});
