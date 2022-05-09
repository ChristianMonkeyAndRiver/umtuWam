import fetch from 'cross-fetch';
import * as config from '../config/config';


async function sendMoyaMessageAfterBeingLiked(number: string) {
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.MOYA_API_KEY}`,
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

    return json;
}

async function sendMoyaMessageAfterMessageHasBeenSent(number: string) {
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.MOYA_API_KEY}`,
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
    const json = await response.json();

    if (json.error != null) throw json;

    return json;
}

async function sendMoyaMessageAfterSubscriptionHasBeenBought(number: string) {
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.MOYA_API_KEY}`,
        },
        body: JSON.stringify({
            to: number,
            recipient_type: 'individual',
            type: 'text',
            text: {
                  body: 'Your subscription on UmtuWam has started and will end in 24 hours.',
            },
        }),
    };

    const response = await fetch(config.MOYA_MESSAGE_API_URL, options);
    const json = await response.json();

    if (json.error != null) throw json;

    return json;
}

async function sendMoyaMessageAfterSubscriptionHasBeenBoughtForSomeoneElse(number: string) {
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.MOYA_API_KEY}`,
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
    const json = await response.json();

    if (json.error != null) throw json;

    return json;
}

export {
    sendMoyaMessageAfterBeingLiked,
    sendMoyaMessageAfterMessageHasBeenSent,
    sendMoyaMessageAfterSubscriptionHasBeenBought,
    sendMoyaMessageAfterSubscriptionHasBeenBoughtForSomeoneElse,
};
