/* eslint-disable @typescript-eslint/no-explicit-any */
import * as xml from 'xml';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const isNextPressed = req.query.isNextPressed ?? '';
            const formattedBool = Array.isArray(isNextPressed) ? isNextPressed[0] : isNextPressed;
            const isFromNextPressedBool = formattedBool.toString();

            await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).get()
                .then(async (document) => {
                    let docs;

                    if (isFromNextPressedBool == '1') {
                        const index = req.query.currentIndex ?? '';
                        const formattedIndex = Array.isArray(index) ? index[0] : index;
                        const currentIndex = formattedIndex.toString();

                        if (index == '') {
                            docs = await admin.firestore().collection(util.FunctionsConstants.Users)
                                .where(util.FunctionsConstants.IsBanned, '==', false)
                                .where(util.FunctionsConstants.Gender, 'in', document.data()?.gender)
                                .where(util.FunctionsConstants.GenderPreference, '==', document.data()?.genderPreference)
                                .where(util.FunctionsConstants.Age, '>=', document.data()?.ageMin)
                                .where(util.FunctionsConstants.Age, '<=', document.data()?.ageMax)
                                .where(util.FunctionsConstants.Location, '==', document.data()?.location)
                                .orderBy(util.FunctionsConstants.Age, 'asc')
                                .orderBy(util.FunctionsConstants.Points, 'desc')
                                .limit(20)
                                .get();
                        } else {
                            const lastVisible = await admin.firestore().collection(util.FunctionsConstants.Users).doc(currentIndex).get();
                            docs = await admin.firestore().collection(util.FunctionsConstants.Users)
                                .where(util.FunctionsConstants.IsBanned, '==', false)
                                .where(util.FunctionsConstants.Gender, 'in', document.data()?.gender)
                                .where(util.FunctionsConstants.GenderPreference, '==', document.data()?.genderPreference)
                                .where(util.FunctionsConstants.Age, '>=', document.data()?.ageMin)
                                .where(util.FunctionsConstants.Age, '<=', document.data()?.ageMax)
                                .where(util.FunctionsConstants.Location, '==', document.data()?.location)
                                .orderBy(util.FunctionsConstants.Age, 'asc')
                                .orderBy(util.FunctionsConstants.Points, 'desc')
                                .startAfter(lastVisible)
                                .limit(20)
                                .get();
                        }
                        document.ref.update({ currentIndex: index });
                    } else {
                        if (document.data()?.currentIndex == '') {
                            docs = await admin.firestore().collection(util.FunctionsConstants.Users)
                                .where(util.FunctionsConstants.IsBanned, '==', false)
                                .where(util.FunctionsConstants.Gender, 'in', document.data()?.gender)
                                .where(util.FunctionsConstants.GenderPreference, '==', document.data()?.genderPreference)
                                .where(util.FunctionsConstants.Age, '>=', document.data()?.ageMin)
                                .where(util.FunctionsConstants.Age, '<=', document.data()?.ageMax)
                                .where(util.FunctionsConstants.Location, '==', document.data()?.location)
                                .orderBy(util.FunctionsConstants.Age, 'asc')
                                .orderBy(util.FunctionsConstants.Points, 'desc')
                                .limit(20)
                                .get();
                        } else {
                            const lastVisible = await admin.firestore().collection(util.FunctionsConstants.Users).doc(document.data()?.currentIndex).get();
                            docs = await admin.firestore().collection(util.FunctionsConstants.Users)
                                .where(util.FunctionsConstants.IsBanned, '==', false)
                                .where(util.FunctionsConstants.Gender, 'in', document.data()?.gender)
                                .where(util.FunctionsConstants.GenderPreference, '==', document.data()?.genderPreference)
                                .where(util.FunctionsConstants.Age, '>=', document.data()?.ageMin)
                                .where(util.FunctionsConstants.Age, '<=', document.data()?.ageMax)
                                .where(util.FunctionsConstants.Location, '==', document.data()?.location)
                                .orderBy(util.FunctionsConstants.Age, 'asc')
                                .orderBy(util.FunctionsConstants.Points, 'desc')
                                .startAfter(lastVisible)
                                .limit(20)
                                .get();
                        }
                    }

                    const usersList: any = [];

                    if (docs.empty) {
                        docs = await admin.firestore().collection(util.FunctionsConstants.Users)
                            .where(util.FunctionsConstants.IsBanned, '==', false)
                            .where(util.FunctionsConstants.Gender, 'in', document.data()?.gender)
                            .where(util.FunctionsConstants.GenderPreference, '==', document.data()?.genderPreference)
                            .where(util.FunctionsConstants.Age, '>=', document.data()?.ageMin)
                            .where(util.FunctionsConstants.Age, '<=', document.data()?.ageMax)
                            .where(util.FunctionsConstants.Location, '==', document.data()?.location)
                            .orderBy(util.FunctionsConstants.Age, 'asc')
                            .orderBy(util.FunctionsConstants.Points, 'desc')
                            .limit(20)
                            .get();
                    }

                    for (const doc of docs.docs) {
                        if (doc.id !== document.id) {
                            const item = {
                                item: [
                                    {
                                        _attr: {
                                            href: `https://us-central1-umtuwam.cloudfunctions.net/http-viewUserProfile?id=${doc.id}&uid=${uid}`,
                                            layout: 'relative',
                                        },
                                    },
                                    {
                                        img: {
                                            _attr: {
                                                url: doc.data().images.length > 0 ? doc.data().images[0] : util.FunctionsConstants.DefaultImage,
                                            },
                                        },
                                    },
                                    {
                                        md: [
                                            {
                                                _attr: {},
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
                    }

                    let currentIndex;
                    if (docs.docs.length == 20) {
                        currentIndex = docs.docs[docs.docs.length - 1].id;
                    } else {
                        currentIndex = '';
                    }

                    const newUsersList = addNextButtonItemXML(usersList, uid, currentIndex);

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

                    res.set('Content-Type', 'application/xml');
                    res.status(200).send(xml(docXML, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
                    return;
                });
        } catch (error) {
            console.error(error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});


function addNextButtonItemXML(itemsArray: any[], uid: string, currentIndex: string) {
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
                    href: `https://us-central1-umtuwam.cloudfunctions.net/http-getProspectiveDatesXml?id=${uid}&isNextPressed=${1}&currentIndex=${currentIndex}`,
                    layout: 'relative',
                },
            },
            {
                md: [
                    {
                        _attr: {},
                    },
                    util.FunctionsConstants.Next,
                ],
            },
        ],
    };
    itemsArray.push(item);
    return itemsArray;
}
