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

            console.log(json);

            uid = json.user_profile.number;

            const doc = await admin.firestore()
                .collection(util.FunctionsConstants.Users)
                .doc(uid)
                .get();

            const randomKey = Math.floor(Math.random() * 100);

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
                                            href: doc.exists ? `https://us-central1-umtuwam.cloudfunctions.net/http-getProspectiveDatesXml?id=${uid}&isNextPressed=${0}&randomKey=${randomKey}` : `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupHome?id=${uid}&randomKey=${randomKey}`,
                                        },
                                    },
                                    util.FunctionsConstants.Home,
                                ],
                            },
                            {
                                menuItem: [
                                    {
                                        _attr: {
                                            img: 'https://umtuwam.web.app/profile_logo.png',
                                            href: doc.exists ? `https://us-central1-umtuwam.cloudfunctions.net/http-getProfileView?id=${uid}&randomKey=${randomKey}` : `https://us-central1-umtuwam.cloudfunctions.net/http-getStartupProfile?id=${uid}&randomKey=${randomKey}`,
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
            res.set('Content-Type', 'application/xml');
            res.set('Max-Age', '0');
            res.set('Cache-Control', 'no-cache');
            res.status(200).send(xml(app, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
