import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';
import {faker} from '@faker-js/faker';

export default functions.runWith({
        timeoutSeconds: 540,
        memory: '512MB',
      }).https.onRequest(async (req, res) => {
        try {
            for (let i = 0; i < 100; i++) {
                const name = faker.name.findName();
                const rand = Math.floor(Math.random()*locationsData.length);
                const location = locationsData[rand];

                const low = 20;
                const high = 30;
                let age = (Math.random()*(high - low)) + low;

                age = Math.ceil(age);

                const randomNumber = Math.floor(Math.random()*2);

                const gender = faker.name.gender(true);

                const preference = randomNumber == 0 ? [faker.name.gender(true)] : ['Male', 'Female'];

                let genderPreference = 'Straight';

                if (preference.length == 1 && preference[0] == gender) {
                    genderPreference = 'Gay';
                }

                await admin.firestore().collection(util.FunctionsConstants.Users).doc(name).set({
                    age: age.toString(),
                    name: name,
                    points: 0,
                    bio: faker.lorem.paragraph(),
                    genderPreference: genderPreference,
                    gender: gender,
                    images: [
                        faker.image.people(480, 480, true),
                        faker.image.people(480, 480, true),
                        faker.image.people(480, 480, true),
                        faker.image.people(480, 480, true),
                        faker.image.people(480, 480, true),
                    ],
                    location: location,
                    isBanned: false,
                    isVerified: false,
                    hasPaidForChats: false,
                    hasPaidForFeatured: false,
                });


                await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(name).set({
                    gender: preference,
                    genderPreference: genderPreference,
                    location: location,
                    ageMin: (age-5).toString(),
                    ageMax: (age+5).toString(),
                    currentIndex: '',
                });
            }

            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
});


const locationsData = [
    'Bloemfontein',
    // 'Cape Town',
    // 'Durban',
    // 'Johannesburg',
    // 'Kimberley',
    // 'Nelspruit',
    // 'PE',
    // 'Polokwane',
    // 'Pretoria',
    // 'Soweto',
];
