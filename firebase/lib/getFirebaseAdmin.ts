import { getGoogleCredsFromENV } from "./getGoogleCredsFromEnv";
import { getGoogleCredsFromFile } from "./getGoogleCredsFromFile";
import * as admin from 'firebase-admin';

export const getFirebaseCreds = () => {
  let googleCreds = {
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || null,
    // The private key must not be accessible on the client side.
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
  }
  if (process.env.GOOGLE_CREDS_CONFIG) {
    googleCreds = getGoogleCredsFromENV()
  }
  if (typeof window === 'undefined' && process.env.GOOGLE_CREDS_PATH) {
    // firebase admin has to be initialized using service acccount json file.
    googleCreds = getGoogleCredsFromFile(process.env.GOOGLE_CREDS_PATH);
  }
  return googleCreds;
}
export const getFirebaseAdmin = () => {
  if(typeof window !== "undefined"){
    throw new Error("getFirebaseAdmin can only be called from node server");
  }
	try {
		if(admin.app())
			return admin.app();
	} catch(e) {
		console.error(e.message);
	}
  const app = admin.initializeApp({
    credential: admin.credential.cert(getFirebaseCreds()) || admin.credential.applicationDefault()
  });
  return app;
}