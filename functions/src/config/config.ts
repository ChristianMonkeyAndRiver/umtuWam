/* eslint-disable camelcase */
'use strict';

const TEST_URL = 'http://localhost:5001/umtuwam/us-central1/testPaymentsAPI';
const TEST_CALL_BACK = 'http://localhost:5001/umtuwam/us-central1/getPaymentAPI';
const MOYA_PAY_URL = 'https://gateway.payments.moyapayd.app/payments/';
const MOYA_PAY_DEVELOPER_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1bXR1d2FtIiwiaWF0IjoxNjUwNjExNjI0LCJzY29wZSI6InBheW1lbnQ6cmVhZCBwYXltZW50OmNyZWF0ZSBjdXN0b21lcjpyZWFkIGN1c3RvbWVyOnBheSJ9.CpJyyMF9rn0jFPZl4iqMclo9oCg62H5G1imvrDKmqNI';
const CALLBACK_URL = 'https://us-central1-umtuwam.cloudfunctions.net/subscriptionCallBackUrl';

const MOYA_API_URL = 'https://api.moya.app/v1/users/';
const MOYA_MESSAGE_API_URL = 'https://api.moya.app/v1/message';
const MOYA_API_KEY = 'kPzzGQ-zipQ-V-m_7uwLpgwfLiY40xap_LJnG8EF5TwwEG--ixj5A_fohjgqmoGd';

export {
    TEST_URL,
    TEST_CALL_BACK,
    MOYA_PAY_URL,
    CALLBACK_URL,
    MOYA_API_URL,
    MOYA_API_KEY,
    MOYA_MESSAGE_API_URL,
    MOYA_PAY_DEVELOPER_KEY,
};
