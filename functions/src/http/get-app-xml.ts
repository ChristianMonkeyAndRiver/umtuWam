import * as xml from 'xml';
import * as cors from 'cors';
import fetch from 'cross-fetch';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as config from '../config/config';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
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
                uid = '27727888675';
            } else {
                uid = '27794614755';
            }
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MOYA_API_KEY}`,
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
                                            href: doc.exists ? `https://us-central1-umtuwam.cloudfunctions.net/http-getProspectiveDatesXml?id=${uid}&isNextPressed=${0}` : `https://umtuwam.web.app/Startup.html?did=${uid}`,
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
                                            href: doc.exists ? `https://us-central1-umtuwam.cloudfunctions.net/http-getMatchesXml?id=${uid}` : `https://umtuwam.web.app/Startup.html?did=${uid}`,
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
                                            href: doc.exists ? `https://us-central1-umtuwam.cloudfunctions.net/http-getPreferencesView?id=${uid}` : `https://umtuwam.web.app/Startup.html?did=${uid}`,
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
                                            href: doc.exists ? `https://us-central1-umtuwam.cloudfunctions.net/http-getProfileView?id=${uid}` : `https://umtuwam.web.app/Startup.html?did=${uid}`,
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
            res.set('Access-Control-Content-Type', 'application/xml');
            res.status(200).send(xml(app, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);

            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});

// let uid = '';

    // if (id == '97618f4b0cec4667' || id == ':"0727779845"') {
    //     uid = '27727888675';
    // } else {
    //     uid = '27794614755';
// }
// `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupHome?id=${uid}`
// `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupMatches?id=${uid}`
// `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupPreferences?id=${uid}`
// `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupProfile?id=${uid}`
