
import * as admin from 'firebase-admin';
import {exportFunctions} from 'better-firebase-functions';

admin.initializeApp();

exportFunctions({__filename, exports});
