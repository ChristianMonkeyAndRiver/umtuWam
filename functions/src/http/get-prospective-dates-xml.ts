/* eslint-disable @typescript-eslint/no-explicit-any */
import * as xml from 'xml';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

const corsHandler = cors({origin: true});

export default functions.https.onRequest(async (req, res) => {
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

                    if (!lastVisible.exists) {
                        res.status(500).send(util.ErrorMessages.NoUserError);
                        return;
                    }

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
});


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
                    href: `https://us-central1-umtuwam.cloudfunctions.net/http-getProspectiveDatesXml?id=${uid}`,
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
