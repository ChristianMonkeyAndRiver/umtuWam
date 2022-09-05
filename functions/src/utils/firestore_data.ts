/* eslint-disable @typescript-eslint/no-explicit-any */
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';

export async function getAdminDocument() {
    return admin
        .firestore()
        .collection(util.FunctionsConstants.AdminData)
        .doc(util.FunctionsConstants.AdminTracker)
        .get();
}

/**
 * Creates a notification for the admin dashboard
 * @param {string} name Name of the user who initiated the action
 * @param {string} docId ID of the document
 * @param {string} type Type of notification
 * @param {string} recipientName If event is gift, add name of person being gifted
 * @param {string} recipientDocId ID of person being gifted
 * @return {Promise} Promise object
 */
export async function addNotification(
    name: string,
    docId: string,
    type: string,
    recipientName?: string,
    recipientDocId?: string
): Promise<any> {
    const now = admin.firestore.Timestamp.now();
    let obj = {};
    if (recipientName != undefined) {
        obj = {
            name: name,
            docId: docId,
            type: type,
            timestamp: now,
            recipientName: recipientName,
            recipientDocId: recipientDocId,
        };
    } else {
        obj = {
            name: name,
            docId: docId,
            type: type,
            timestamp: now,
        };
    }
    return admin.firestore().collection(util.FunctionsConstants.Notifications).doc().set(obj);
}

export async function addReportNotification(name: string, docId: string) {
    const now = admin.firestore.Timestamp.now();
    return admin.firestore().collection(util.FunctionsConstants.Notifications).doc().set({
        name: name,
        docId: docId,
        type: 'report',
        timestamp: now,
    });
}

export async function addNewUserSignupNotification(name: string, docId: string) {
    const now = admin.firestore.Timestamp.now();
    return admin.firestore().collection(util.FunctionsConstants.Notifications).doc().set({
        name: name,
        docId: docId,
        type: 'signUp',
        timestamp: now,
    });
}

export async function addSubscriptionNotification(name: string, docId: string) {
    const now = admin.firestore.Timestamp.now();
    return admin.firestore().collection(util.FunctionsConstants.Notifications).doc().set({
        name: name,
        docId: docId,
        type: 'subscription',
        timestamp: now,
    });
}

export async function addOtherSubscriptionNotification(
    name: string,
    docId: string,
    recipientName: string,
    recipientDocId: string
) {
    const now = admin.firestore.Timestamp.now();
    return admin.firestore().collection(util.FunctionsConstants.Notifications).doc().set({
        name: name,
        docId: docId,
        timestamp: now,
        recipientName: recipientName,
        recipientDocId: recipientDocId,
        type: 'otherSubscription',
    });
}
