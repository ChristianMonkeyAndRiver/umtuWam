import * as admin from 'firebase-admin';
import * as util from '../utils/constants';

export async function getAdminDocument() {
    return admin.firestore().collection(util.FunctionsConstants.AdminData)
            .doc(util.FunctionsConstants.AdminTracker)
            .get();
}

export async function addReportNotification(name: string, docId: string) {
    const now = admin.firestore.Timestamp.now();
    return admin.firestore().collection(util.FunctionsConstants.Notifications)
            .doc()
            .set({
                name: name,
                docId: docId,
                type: 'report',
                timestamp: now,
            });
}

export async function addNewUserSignupNotification(name: string, docId: string) {
    const now = admin.firestore.Timestamp.now();
    return admin.firestore().collection(util.FunctionsConstants.Notifications)
            .doc()
            .set({
                name: name,
                docId: docId,
                type: 'signUp',
                timestamp: now,
            });
}

export async function addSubscriptionNotification(name: string, docId: string) {
    const now = admin.firestore.Timestamp.now();
    return admin.firestore().collection(util.FunctionsConstants.Notifications)
            .doc()
            .set({
                name: name,
                docId: docId,
                type: 'subscription',
                timestamp: now,
            });
}

export async function addOtherSubscriptionNotification(name: string, docId: string, recipientName: string, recipientDocId: string) {
    const now = admin.firestore.Timestamp.now();
    return admin.firestore().collection(util.FunctionsConstants.Notifications)
            .doc()
            .set({
                name: name,
                docId: docId,
                timestamp: now,
                recipientName: recipientName,
                recipientDocId: recipientDocId,
                type: 'otherSubscription',
            });
}
