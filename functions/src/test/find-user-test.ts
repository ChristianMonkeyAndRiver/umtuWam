import fetch from 'cross-fetch';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

export default functions.https.onRequest(async (req, res) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MOYA_PAY_DEVELOPER_KEY}`,
      },
    };

    fetch('https://api.moya.app/v1/users/27794614755', options)
      .then((result) => result.json())
      .then((json) => {
        res.status(200).send(json);
        return;
      });
  } catch (error) {
    console.error(util.ErrorMessages.ErrorText, error);

    res.status(404).send(util.ErrorMessages.UnexpectedError);
    return;
  }
});