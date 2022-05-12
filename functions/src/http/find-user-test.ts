import fetch from 'cross-fetch';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

export default functions.https.onRequest(async (req, res) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer kPzzGQ-zipQ-V-m_7uwLpgwfLiY40xap_LJnG8EF5TwwEG--ixj5A_fohjgqmoGd',
      },
    };

    fetch('https://api.moya.app/v1/users/27794614755', options)
      .then((result) => result.json())
      .then((json) => {
        console.log(json.user_profile.did);
        res.status(200).send(json);
        return;
      });
  } catch (error) {
    console.error(util.ErrorMessages.ErrorText, error);

    res.status(404).send(util.ErrorMessages.UnexpectedExrror);
    return;
  }
});
