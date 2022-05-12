
import * as admin from 'firebase-admin';
import { exportFunctions } from 'better-firebase-functions';

if (!admin.apps.length) {
    admin.initializeApp();
}

exportFunctions({ __filename, exports });
