/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'cross-fetch';
import * as config from '../config/config';
import * as util from '../utils/constants';

/**
 * Sends a Moya message to a user
 * @param {string} number The phone number that will receive the message
 * @param {string} event The type of message being sent - ex: Liked, Subscription
 * @param {boolean} isGift If the subscription is a gift or not
 * @param {string} productId The type of subscription being bought - ex: Boost
 * @return {Promise} Returns a promise event
 */
async function sendMoyaMessage(number: string, event: string, isGift?: boolean, productId?: string): Promise<any> {
    let message = '';
    switch (event) {
        case util.Events.Liked:
            message = 'Someone has Liked you back on UmtuWam - click to see who it is.';
            break;
        case util.Events.Message:
            message = 'Someone has sent you a message on UmtuWam - click to see who it is.';
            break;
        case util.Events.Subscription:
            if (isGift) {
                message = 'Someone has gifted you a subscription to UmtuWam Dating! Click to go and chat to them!';
            } else {
                switch (productId) {
                    case util.Products.ChatsAndPhotos:
                        message = 'Your subscription on UmtuWam has started and will end in 30 days.';
                        break;
                    case util.Products.Boost:
                        message = 'Your subscription on UmtuWam has started and will end in 24 hours.';
                        break;
                    case util.Products.Verified:
                        message = 'Your profile is now Verified!';
                        break;
                }
            }
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MOYA_API_KEY}`,
        },
        body: JSON.stringify({
            to: number,
            recipient_type: 'individual',
            type: 'text',
            text: {
                body: message,
            },
        }),
    };

    const response = await fetch(config.MOYA_MESSAGE_API_URL, options);

    return response.json();
}

// async function sendMoyaMessageAfterBeingLiked(number: string) {
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.MOYA_API_KEY}`,
//         },
//         body: JSON.stringify({
//             to: number,
//             recipient_type: 'individual',
//             type: 'text',
//             text: {
//                 body: 'Someone has Liked you back on UmtuWam - click to see who it is.',
//             },
//         }),
//     };

//     const response = await fetch(config.MOYA_MESSAGE_API_URL, options);
//     const json = await response.json();

//     if (json.error != null) throw json;

//     return;
// }

// async function sendMoyaMessageAfterMessageHasBeenSent(number: string) {
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.MOYA_API_KEY}`,
//         },
//         body: JSON.stringify({
//             to: number,
//             recipient_type: 'individual',
//             type: 'text',
//             text: {
//                 body: 'Someone has sent you a message on UmtuWam - click to read it',
//             },
//         }),
//     };

//     const response = await fetch(config.MOYA_MESSAGE_API_URL, options);
//     // const json = await response.json();

//     return response.json();
//     // if (json.error != null) throw json;

//     // return;
// }

// async function sendMoyaMessageAfterSubscriptionHasBeenBought(number: string, productId: string) {
//     console.log('Sending message after subscription');
//     let message = '';
//     switch (productId) {
//         case util.Products.ChatsAndPhotos:
//             message = 'Your subscription on UmtuWam has started and will end in 30 days.';
//             break;
//         case util.Products.Boost:
//             message = 'Your subscription on UmtuWam has started and will end in 24 hours.';
//             break;
//         case util.Products.Verified:
//             message = 'Your profile is now Verified!';
//             break;
//     }
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.MOYA_API_KEY}`,
//         },
//         body: JSON.stringify({
//             to: number,
//             recipient_type: 'individual',
//             type: 'text',
//             text: {
//                 body: productId == message,
//             },
//         }),
//     };

//     const response = await fetch(config.MOYA_MESSAGE_API_URL, options);

//     return response.json();
//     // const json = await response.json();

//     // if (json.error != null) throw json;

//     // return;
// }

// async function sendMoyaMessageAfterSubscriptionHasBeenBoughtForSomeoneElse(number: string) {
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.MOYA_API_KEY}`,
//         },
//         body: JSON.stringify({
//             to: number,
//             recipient_type: 'individual',
//             type: 'text',
//             text: {
//                 body: 'Someone has gifted you a subscription to UmtuWam Dating! Click to go and chat to them!',
//             },
//         }),
//     };

//     const response = await fetch(config.MOYA_MESSAGE_API_URL, options);
//     return response.json();
//     // const json = await response.json();

//     // if (json.error != null) throw json;

//     // return;
// }

export { sendMoyaMessage };
