/* eslint-disable camelcase */
'use strict';

const TEST_URL = 'http://localhost:5001/umtuwam/us-central1/testPaymentsAPI';
const TEST_CALL_BACK = 'http://localhost:5001/umtuwam/us-central1/getPaymentAPI';
const MOYA_PAY_URL = 'https://gateway.payments.moyapayd.app/payments/';
const MOYA_PAY_DEVELOPER_KEY = 'R8kKpTPM8QJNRgW';
const CALLBACK_URL = 'https://us-central1-umtuwam.cloudfunctions.net/subscriptionCallBackUrl';

export {
    TEST_URL,
    TEST_CALL_BACK,
    MOYA_PAY_URL,
    CALLBACK_URL,
    MOYA_PAY_DEVELOPER_KEY,
};
