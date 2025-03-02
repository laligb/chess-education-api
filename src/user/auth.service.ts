import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // ✅ Ensure this is configured
  });
}

@Injectable()
export class AuthService {
  async verifyFirebaseToken(token: string): Promise<DecodedIdToken | null> {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (error: unknown) {
      console.error('Firebase Token Verification Error:', error);
      return null; // ✅ Safe return if token verification fails
    }
  }
}
