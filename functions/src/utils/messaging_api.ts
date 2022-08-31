import fetch from 'cross-fetch';
import * as config from '../config/config';
import * as util from '../utils/constants';

async function sendMoyaMessageAfterBeingLiked(number: string) {
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
                body: 'Someone has Liked you back on UmtuWam - click to see who it is.',
            },
        }),
    };

    const response = await fetch(config.MOYA_MESSAGE_API_URL, options);
    const json = await response.json();

    if (json.error != null) throw json;

    return;
}

async function sendMoyaMessageAfterMessageHasBeenSent(number: string) {
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
                body: 'Someone has sent you a message on UmtuWam - click to read it',
            },
        }),
    };

    const response = await fetch(config.MOYA_MESSAGE_API_URL, options);
    // const json = await response.json();

    return response.json();
    // if (json.error != null) throw json;

    // return;
}

async function sendMoyaMessageAfterSubscriptionHasBeenBought(number: string, productId: string) {
    console.log('Sending message after subscription');
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
                body: productId == util.Products.ChatsAndPhotos ? 'Your subscription on UmtuWam has started and will end in 30 days.' : 'Your subscription on UmtuWam has started and will end in 24 hours.',
            },
        }),
    };

    const response = await fetch(config.MOYA_MESSAGE_API_URL, options);

    return response.json();
    // const json = await response.json();

    // if (json.error != null) throw json;

    // return;
}

async function sendMoyaMessageAfterSubscriptionHasBeenBoughtForSomeoneElse(number: string) {
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
                body: 'Someone has gifted you a subscription to UmtuWam Dating! Click to go and chat to them!',
            },
        }),
    };

    const response = await fetch(config.MOYA_MESSAGE_API_URL, options);
    return response.json();
    // const json = await response.json();

    // if (json.error != null) throw json;

    // return;
}

export {
    sendMoyaMessageAfterBeingLiked,
    sendMoyaMessageAfterMessageHasBeenSent,
    sendMoyaMessageAfterSubscriptionHasBeenBought,
    sendMoyaMessageAfterSubscriptionHasBeenBoughtForSomeoneElse,
};
