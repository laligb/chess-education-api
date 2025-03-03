import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
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
