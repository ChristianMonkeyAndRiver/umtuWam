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
        const stringBinuHeaders = ['x-binu-did', 'X-Binu-Did', 'x-Binu-did', 'x-Binu-Did', 'xbinu-did'];
        const maxDebugHeaders = ['xbinu', 'x-binu'];

        let headerInfo;
        let did;
        for (let i = 0; i < stringBinuHeaders.length && headerInfo == undefined; i++) {
            const capturedHeader = header[stringBinuHeaders[i]];
            headerInfo = capturedHeader != undefined ? capturedHeader : undefined;
        }
        if (headerInfo == undefined) {
            // Do check for Max Debug APP headers
            for (let i = 0; i < maxDebugHeaders.length && headerInfo == undefined; i++) {
                const capturedHeader = header[maxDebugHeaders[i]];
                headerInfo = capturedHeader != undefined ? capturedHeader : undefined;
            }
        }
        if (headerInfo != undefined) {
            // Assume the header has been captured and proceed with reading
            const tmp = JSON.parse(JSON.stringify(headerInfo));
            if (tmp != null && tmp.did != undefined) {
                // Assume we received a non-object
                did = tmp['did'];
            } else {
                did = headerInfo;
            }
            if (!(did.length > 0)) {
                // DID could not be parsed, big problem
                did = null;
            }
        }

        try {
            let uid = '';
            if (did != null) {
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.MOYA_API_KEY}`,
                    },
                };
                const result = await fetch(`${config.MOYA_API_URL}${did}`, options);
                const json = await result.json();
                uid = json.user_profile.number;
            } else {
                uid = 'undefined';
            }

            const doc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            // Links to logos
            const DatesLogo = 'https://umtuwam.web.app/logo.png';
            const MatchesLogo = 'https://umtuwam.web.app/chat_logo.png';
            const PreferencesLogo = 'https://umtuwam.web.app/filter_1.png';
            const ProfileLogo = 'https://umtuwam.web.app/profile_logo.png';

            // Links to pages
            let DatesLink = '';
            let MatchesLink = '';
            let PreferencesLink = '';
            let ProfileLink = '';

            if (doc.exists) {
                DatesLink = `https://us-central1-umtuwam.cloudfunctions.net/http-getProspectiveDatesXml?id=${uid}&isNextPressed=${0}`;
                MatchesLink = `https://us-central1-umtuwam.cloudfunctions.net/http-getMatchesXml?id=${uid}`;
                PreferencesLink = `https://us-central1-umtuwam.cloudfunctions.net/http-getPreferencesView?id=${uid}`;
                ProfileLink = `https://us-central1-umtuwam.cloudfunctions.net/http-getProfileView?id=${uid}`;
            } else {
                DatesLink = `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupHome?id=${uid}`;
                MatchesLink = `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupMatches?id=${uid}`;
                PreferencesLink = `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupPreferences?id=${uid}`;
                ProfileLink = `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupProfile?id=${uid}`;
            }

            const app = [
                {
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
                                                img: DatesLogo,
                                                href: DatesLink,
                                            },
                                        },
                                        util.FunctionsConstants.Home,
                                    ],
                                },
                                {
                                    menuItem: [
                                        {
                                            _attr: {
                                                img: MatchesLogo,
                                                href: MatchesLink,
                                            },
                                        },
                                        util.FunctionsConstants.Chats,
                                    ],
                                },
                                {
                                    menuItem: [
                                        {
                                            _attr: {
                                                img: PreferencesLogo,
                                                href: PreferencesLink,
                                            },
                                        },
                                        util.FunctionsConstants.PreferencesCapital,
                                    ],
                                },
                                {
                                    menuItem: [
                                        {
                                            _attr: {
                                                img: ProfileLogo,
                                                href: ProfileLink,
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
                },
            ];
            res.set('Content-Type', 'application/xml');
            if (!doc.exists) {
                res.set('Max-Age', '0');
                res.set('Cache-Control', 'no-cache');
            }
            res.status(200).send(
                xml(app, {
                    declaration: { standalone: 'yes', encoding: 'UTF-8' },
                })
            );
            return;
        } catch (error) {
            console.error(error);
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
