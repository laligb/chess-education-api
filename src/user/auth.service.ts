import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

if (!admin.apps.length) {
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
}
