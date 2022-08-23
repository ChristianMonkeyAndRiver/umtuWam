
import * as admin from 'firebase-admin';
import { exportFunctions } from 'better-firebase-functions';

if (admin.apps.length === 0) {
    admin.initializeApp();
}

exportFunctions({ __filename, exports });
