/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

const addTestUsers = async (req:functions.https.Request, res: functions.Response) => {
    try {
        for (const user of userTestData) {
            const ageNumber = Number(user.age);

            const ageMin = ageNumber - 5;
            const ageMax = ageNumber + 5;

            const userId = `${user.name}_${user.location}`;

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(userId).set({
                age: user.age,
                name: user.name,
                bio: user.bio,
                gender: user.gender,
                images: user.images,
                location: user.location,
                lookingFor: user.lookingFor,
                uid: user.uid,
            });

            await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(userId).set({
                gender: user.lookingFor,
                location: user.location,
                ageMin: ageMin.toString(),
                ageMax: ageMax.toString(),
                uid: user.uid,
            });
        }
        res.status(200).send(util.SuccessMessages.SuccessMessage);
        return;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const addTestChatsUsers = async (req:functions.https.Request, res: functions.Response) => {
    try {
        for (const user of userTestChat) {
            const chatId = user.senderId.concat('_').concat(user.recipientId);
            const timestamp = admin.firestore.Timestamp.now();

            admin.firestore().collection(util.FunctionsConstants.Users).doc(user.senderId).collection(util.FunctionsConstants.Chats).doc(chatId).collection(util.FunctionsConstants.Messages)
            .doc()
            .set({
                idFrom: user.senderId,
                idTo: user.recipientId,
                timestamp: timestamp,
                content: user.content.replace(util.FunctionsConstants.SpaceParsedValue, ' '),
            });

            const chatId2 = user.recipientId.concat('_').concat(user.senderId);

            admin.firestore().collection(util.FunctionsConstants.Users).doc(user.recipientId).collection(util.FunctionsConstants.Chats).doc(chatId2).collection(util.FunctionsConstants.Messages)
            .doc()
            .set({
                idFrom: user.senderId,
                idTo: user.recipientId,
                timestamp: timestamp,
                content: user.content.replace(util.FunctionsConstants.SpaceParsedValue, ' '),
            });
        }
        res.status(200).send(util.SuccessMessages.SuccessMessage);
        return;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const userTestData = [
    {
        age: '20',
        name: 'John Doe',
        bio: 'John Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'female',
        uid: '0789956621',
    },
    {
        age: '23',
        name: 'Peter Doe',
        bio: 'Peter Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'female',
        uid: '0789956622',
    },
    {
        age: '26',
        name: 'Mark Doe',
        bio: 'Mark Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Cape Town',
        lookingFor: 'female',
        uid: '0789956623',
    },
    {
        age: '29',
        name: 'Craig Doe',
        bio: 'Craig Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80'],
        location: 'Cape Town',
        lookingFor: 'female',
        uid: '0789956624',
    },
    {
        age: '32',
        name: 'Ronny Doe',
        bio: 'Ronny Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1496302662116-35cc4f36df92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'female',
        uid: '0789956625',
    },
    {
        age: '35',
        name: 'James Doe',
        bio: 'James Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'female',
        uid: '0789956626',
    },
    {
        age: '38',
        name: 'Anthony Doe',
        bio: 'Anthony Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80'],
        location: 'Cape Town',
        lookingFor: 'female',
        uid: '0789956627',
    },
    {
        age: '41',
        name: 'Hamilton Doe',
        bio: 'Hamilton Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Cape Town',
        lookingFor: 'female',
        uid: '0789956628',
    },
    {
        age: '18',
        name: 'Timmy Doe',
        bio: 'Timmy Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80'],
        location: 'Johannesburg',
        lookingFor: 'female',
        uid: '0789956629',
    },
    {
        age: '21',
        name: 'Jacob Doe',
        bio: 'Jacob Doe Test Bio',
        gender: 'male',
        images: ['https://images.unsplash.com/photo-1523910088385-d313124c68aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'female',
        uid: '0789956620',
    },
    // ==============================================================================================
    {
        age: '20',
        name: 'Susan Taylor',
        bio: 'John Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1525875975471-999f65706a10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'male',
        uid: '0849956621',
    },
    {
        age: '23',
        name: 'Abby Taylor',
        bio: 'Abby Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1588701177361-c42359b29f68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'male',
        uid: '0849956622',
    },
    {
        age: '26',
        name: 'Sarah Taylor',
        bio: 'Sarah Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1615473967657-9dc21773daa3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Cape Town',
        lookingFor: 'male',
        uid: '0849956623',
    },
    {
        age: '29',
        name: 'Craig Taylor',
        bio: 'Craig Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Cape Town',
        lookingFor: 'male',
        uid: '0849956624',
    },
    {
        age: '32',
        name: 'Barbra Taylor',
        bio: 'Ronny Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1648737963503-1a26da876aca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'male',
        uid: '0849956625',
    },
    {
        age: '35',
        name: 'Tare Taylor',
        bio: 'James Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80'],
        location: 'Johannesburg',
        lookingFor: 'male',
        uid: '0849956626',
    },
    {
        age: '38',
        name: 'Shannon Taylor',
        bio: 'Anthony Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=853&q=80'],
        location: 'Cape Town',
        lookingFor: 'male',
        uid: '0849956627',
    },
    {
        age: '41',
        name: 'Caitlyn Taylor',
        bio: 'Caitlyn Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1648737963059-59ec8e2d50c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Cape Town',
        lookingFor: 'male',
        uid: '0849956628',
    },
    {
        age: '18',
        name: 'Chrystal Taylor',
        bio: 'Chrystal Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'],
        location: 'Johannesburg',
        lookingFor: 'male',
        uid: '0849956629',
    },
    {
        age: '21',
        name: 'Silver Taylor',
        bio: 'Silver Taylor Test Bio',
        gender: 'female',
        images: ['https://images.unsplash.com/photo-1648737965955-735637020c7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80'],
        location: 'Johannesburg',
        lookingFor: 'male',
        uid: '0849956620',
    },
];

const userTestChat = [
    {
        'content': 'Hi',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'How are you?',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },
    {
        'content': 'Im all good now girl :)',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'Ohh really now ?',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },
    {
        'content': 'Yeah girl fr! why wouldnt I be excited, speaking to a fine ting like yourself!!',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'psshhh you probably say that to all the girls. SO dont even try that shit with me.',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },
    {
        'content': 'Youre right I say it to all the girls, but only the ones I actually like. And rn that person is you.',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'ncaww fr?!',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },
    {
        'content': 'yeah baby girl fr fr',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'So what you been up to then',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },

    {
        'content': 'just chillin, been a slow day wby?',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },


];

export {
    addTestUsers,
    addTestChatsUsers,
};