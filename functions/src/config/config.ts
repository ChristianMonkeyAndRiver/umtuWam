/* eslint-disable camelcase */
'use strict';

const TEST_URL = 'http://localhost:5001/umtuwam/us-central1/testPaymentsAPI';
const TEST_CALL_BACK = 'http://localhost:5001/umtuwam/us-central1/getPaymentAPI';
const MOYA_PAY_URL = 'https://gateway.payments.moyapayd.app/payments/';
const MOYA_PAY_DEVELOPER_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1bXR1d2FtIiwiaWF0IjoxNjUwNjExNjI0LCJzY29wZSI6InBheW1lbnQ6cmVhZCBwYXltZW50OmNyZWF0ZSBjdXN0b21lcjpyZWFkIGN1c3RvbWVyOnBheSJ9.CpJyyMF9rn0jFPZl4iqMclo9oCg62H5G1imvrDKmqNI';
const CALLBACK_URL = 'https://us-central1-umtuwam.cloudfunctions.net/http-subscriptionCallbackUrl';

const MOYA_API_URL = 'https://api.moya.app/v1/users/';
const MOYA_MESSAGE_API_URL = 'https://api.moya.app/v1/message';

const FLASH_ACCOUNT_NUMBER = '6240-4769-7412-8142';
const FLASH_SANDBOX_TOKEN = 'e9862cd3-b429-32ec-b502-7528d7b7058f';
const FLASH_TEST_URL = 'https://api.flashswitch.flash-group.com/1foryou/1.0.0/redeem';

export {
    TEST_URL,
    FLASH_TEST_URL,
    TEST_CALL_BACK,
    MOYA_PAY_URL,
    CALLBACK_URL,
    MOYA_API_URL,
    FLASH_ACCOUNT_NUMBER,
    FLASH_SANDBOX_TOKEN,
    MOYA_MESSAGE_API_URL,
    MOYA_PAY_DEVELOPER_KEY,
};
