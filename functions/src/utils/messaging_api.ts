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
                  body: 'Hello World',
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
                  body: 'Hello World',
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
                  body: 'Hello World',
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
                  body: 'Hello World',
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
