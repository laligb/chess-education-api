import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

if (!admin.apps.length) {
  console.log('🔥 Firebase Credentials:', {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? '✅ Exists' : '❌ Missing',
  });

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n',
      ).replace(/"/g, ''),
    }),
  });
}

@Injectable()
export class AuthService {
  async verifyFirebaseToken(token: string): Promise<DecodedIdToken | null> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      console.error('❌ Firebase Token Verification Error:', error);
      return null;
    }
  }

  async createFirebaseUser(
    email: string,
    password: string,
  ): Promise<admin.auth.UserRecord | null> {
    try {
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
      });
      console.log('Successfully created Firebase user:', userRecord.uid);
      return userRecord;
    } catch (error) {
      console.error('❌ Firebase User Creation Error:', error);
      return null;
    }
  }

  async deleteFirebaseUser(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
      console.log(`✅ Deleted Firebase user: ${uid}`);
    } catch (error) {
      console.error(`❌ Failed to delete Firebase user: ${uid}`, error);
    }
  }
}
